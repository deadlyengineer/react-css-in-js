import { _getJoinedSelectors } from './_getJoinedSelectors';
import { _getTokenValues } from './_getTokenValues';
import { _getTokenProperty } from './_getTokenProperty';
import { _getConfig } from './_getConfig';
import { ICssBlock, _AtRuleConditional, _AtRuleNested, _AtRuleNone, _AtRuleSimple } from './types/ICssBlock';
import { ICssBuilder } from './types/ICssBuilder';
import { defaultCssPrinter } from '../defaultCssPrinter';

const atRuleConditionalTypes: readonly string[] = ['media', 'supports', 'document'];
const atRuleNestedTypes: readonly string[] = ['keyframes', 'font-feature-values'];

export function _getCssBuilder(className?: string): ICssBuilder {
  const rootSelectors = [className ? '.' + className : ':root'];
  const printer = _getConfig().customCssPrinter ?? defaultCssPrinter;
  const blocks: ICssBlock[] = [];

  __openBlock('', rootSelectors, { _isVirtual: true });

  let imports = '';
  let result = '';

  function _openBlock(token: string[]) {
    const values = _getTokenValues(token);
    const currentBlock = blocks[0];
    const parentSelectors = currentBlock._selectors;
    const allowNesting = currentBlock._atRuleGroupLevel >= _AtRuleNested;
    const indent = currentBlock._indent + (allowNesting ? '  ' : '');

    if (currentBlock._isWritten && !allowNesting) {
      result += printer.closeBlock(currentBlock._indent);
      currentBlock._isWritten = false;
    }

    if (token[0] === '@') {
      const atRuleType = token[1];
      const _atRuleGroupLevel =
        atRuleConditionalTypes.indexOf(atRuleType) >= 0
          ? _AtRuleConditional
          : atRuleNestedTypes.indexOf(atRuleType) >= 0
          ? _AtRuleNested
          : _AtRuleSimple;

      __openBlock(indent, [printer.csv(values)], { _atRuleGroupLevel });

      if (_atRuleGroupLevel >= _AtRuleConditional) {
        __openBlock(indent + '  ', parentSelectors, { _isVirtual: true });
      }
    } else {
      __openBlock(indent, _getJoinedSelectors(values, parentSelectors));
    }
  }

  function _closeBlock() {
    while (__closeBlock()?._isVirtual);
  }

  function _property(token: readonly string[]) {
    const currentBlock = blocks[0];
    const isAtRule = token[0] === '@';

    let indent: string;

    if (isAtRule) {
      // At-rule

      if (token[1] === 'charset') {
        return;
      }

      if (token[1] === 'import') {
        // Hoist @import rules to the top of the CSS text.
        imports += printer.property('', printer.csv(_getTokenValues(token)));
        return;
      }

      if (currentBlock._isWritten && currentBlock._atRuleGroupLevel < _AtRuleNested) {
        result += currentBlock._suffix;
        currentBlock._isWritten = false;
      }

      const parent = blocks.find((block) => block._atRuleGroupLevel >= _AtRuleNested);

      indent = parent ? parent._indent + '  ' : '';
    } else {
      indent = currentBlock._indent + '  ';
    }

    const property = _getTokenProperty(token);

    if (!property) {
      return;
    }

    for (let i = blocks.length - 1; i >= 0; --i) {
      const block = blocks[i];

      if (((i === 0 && !isAtRule) || block._atRuleGroupLevel >= _AtRuleNested) && !block._isWritten) {
        result += block._prefix;
        block._isWritten = true;
      }
    }

    const key = printer.csv(property[0]);
    const value = printer.csv(property[1], key);

    result += printer.property(indent, key, value);
  }

  function _build() {
    while (__closeBlock());
    return [imports, result].filter((value) => !!value).join('\n');
  }

  function __openBlock(
    _indent: string,
    _selectors: string[] = rootSelectors,
    {
      _isVirtual = false,
      _atRuleGroupLevel = _AtRuleNone,
    }: Partial<Pick<ICssBlock, '_isVirtual' | '_atRuleGroupLevel'>> = {}
  ) {
    blocks.unshift({
      _prefix: printer.openBlock(_indent, _selectors),
      _suffix: printer.closeBlock(_indent),
      _indent,
      _isWritten: false,
      _isVirtual,
      _atRuleGroupLevel,
      _selectors: _atRuleGroupLevel ? undefined : _selectors,
    });
  }

  function __closeBlock(): ICssBlock | undefined {
    const block = blocks[0];

    if (block) {
      if (block._isWritten) {
        result += block._suffix;
        block._isWritten = false;
      }

      blocks.shift();
    }

    return block;
  }

  return { _openBlock, _closeBlock, _property, _build };
}

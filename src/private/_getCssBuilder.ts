import { _isBrowser } from './_constants';
import { _getConfig } from './_getConfig';
import { _getJoinedSelectors } from './_getJoinedSelectors';
import { _printerDefault } from './_printerDefault';
import { _printerPretty } from './_printerPretty';
import { ICssBlock, _AtRuleConditional, _AtRuleNested, _AtRuleNone, _AtRuleSimple } from './types/ICssBlock';
import { ICssBuilder } from './types/ICssBuilder';

export function _getCssBuilder(className?: string): ICssBuilder {
  const { pretty = _isBrowser } = _getConfig();
  const rootSelectors = [className ? '.' + className : ':root'];
  const printer = pretty ? _printerPretty : _printerDefault;
  const blocks: ICssBlock[] = [];

  __openBlock('', rootSelectors, { _isVirtual: true });

  let result = '';

  function _openBlock(selectors: string[]) {
    const currentBlock = blocks[0];
    const parentSelectors = currentBlock._selectors;
    const allowNesting = currentBlock._atRuleGroupLevel >= _AtRuleNested;
    const indent = currentBlock._indent + (allowNesting ? '  ' : '');

    if (currentBlock._isWritten && !allowNesting) {
      result += printer._closeBlock(currentBlock._indent);
      currentBlock._isWritten = false;
    }

    if (selectors[0][0] === '@') {
      const _atRuleGroupLevel = /^@(media|supports|document)\b/.test(selectors[0])
        ? _AtRuleConditional
        : /^@(keyframes|font-feature-values)\b/.test(selectors[0])
        ? _AtRuleNested
        : _AtRuleSimple;

      __openBlock(indent, [printer._csv(selectors)], { _atRuleGroupLevel });

      if (_atRuleGroupLevel >= _AtRuleConditional) {
        __openBlock(indent + '  ', parentSelectors, { _isVirtual: true });
      }
    } else {
      const joinedSelectors = _getJoinedSelectors(selectors, parentSelectors);

      __openBlock(indent, joinedSelectors);
    }
  }

  function _closeBlock() {
    while (__closeBlock()?._isVirtual);
  }

  function _property(keys: string[], values?: string[]) {
    const currentBlock = blocks[0];
    const isAtRule = keys[0][0] === '@';

    let indent: string;

    if (isAtRule) {
      if (currentBlock._isWritten && currentBlock._atRuleGroupLevel < _AtRuleNested) {
        result += currentBlock._suffix;
        currentBlock._isWritten = false;
      }

      const parent = blocks.find((block) => block._atRuleGroupLevel >= _AtRuleNested);

      indent = parent ? parent._indent + '  ' : '';
    } else {
      indent = currentBlock._indent + '  ';
    }

    for (let i = blocks.length - 1; i >= 0; --i) {
      const block = blocks[i];

      if (((i === 0 && !isAtRule) || block._atRuleGroupLevel >= _AtRuleNested) && !block._isWritten) {
        result += block._prefix;
        block._isWritten = true;
      }
    }

    result += printer._property(indent, printer._csv(keys), values && printer._csv(values));
  }

  function _build() {
    while (__closeBlock());
    return result;
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
      _prefix: printer._openBlock(_indent, _selectors),
      _suffix: printer._closeBlock(_indent),
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

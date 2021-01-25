import { _getConfig } from './_getConfig';
import { _getSelectors } from './_getSelectors';
import { _printerDefault } from './_printerDefault';
import { _printerPretty } from './_printerPretty';
import { ICssBlock } from './ICssBlock';
import { ICssBuilder } from './ICssBuilder';

export function _getCssBuilder(rootSelector = ':root'): ICssBuilder {
  const { pretty } = _getConfig();
  const printer = pretty ? _printerPretty : _printerDefault;
  const blocks: ICssBlock[] = [];

  let result = '';
  let buffer = '';
  let space = false;
  let values: string[] = [];

  function _word(value: string) {
    if (buffer && space) {
      buffer += ' ';
      space = false;
    }

    buffer += value;
  }

  function _space() {
    space = true;
  }

  function _value() {
    if (buffer) {
      values.push(buffer);
      buffer = '';
    }

    space = false;
  }

  function _openBlock() {
    _value();

    const currentValues = values;

    values = [];

    const prevBlock = blocks[0];
    const prevSelectors = prevBlock?._selectors?.length ? prevBlock._selectors : [rootSelector];
    const indent = (prevBlock?._indent ?? '') + (prevBlock?._allowNesting ? '  ' : '');

    if (prevBlock && !prevBlock._allowNesting && prevBlock._isWritten) {
      result += printer._blockClose(prevBlock._indent);
      prevBlock._isWritten = false;
    }

    if (currentValues[0]?.[0] === '@') {
      const isConditionalGroup = /^@(media|supports|document)\b/.test(currentValues[0]);
      const isNesting = isConditionalGroup || /^@(keyframes|font-feature-values)\b/.test(currentValues[0]);

      __openBlock({
        _identifier: printer._identifier(indent, currentValues),
        _indent: indent,
        _allowNesting: isNesting,
      });

      if (isConditionalGroup) {
        __openBlock({
          _identifier: printer._identifier(indent + '  ', prevSelectors),
          _indent: indent + '  ',
          _isVirtual: true,
          _selectors: prevSelectors,
        });
      }
    } else {
      const extendedSelectors = _getSelectors(currentValues, prevSelectors);

      __openBlock({
        _identifier: printer._identifier(indent, extendedSelectors),
        _indent: indent,
        _selectors: extendedSelectors,
      });
    }
  }

  function _closeBlock() {
    while (__closeBlock()?._isVirtual);
  }

  function _property() {
    _value();

    if (values.length === 0) {
      return;
    }

    const prevBlock = blocks[0];
    const isAtRule = values[0][0] === '@';

    let indent: string;

    if (values[0][0] === '@') {
      if (prevBlock && !prevBlock._allowNesting && prevBlock._isWritten) {
        result += printer._blockClose(prevBlock._indent);
        prevBlock._isWritten = false;
      }

      const parent = blocks.find((block) => block._allowNesting);

      indent = parent ? `${parent._indent}  ` : '';
    } else if (!prevBlock) {
      __openBlock({ _identifier: rootSelector, _isVirtual: true, _selectors: [rootSelector] });
      indent = '  ';
    } else {
      indent = `${prevBlock._indent}  `;
    }

    for (let i = blocks.length - 1; i >= 0; --i) {
      const block = blocks[i];

      if (((i === 0 && !isAtRule) || block._allowNesting) && !block._isWritten) {
        result += `${block._identifier}${printer._blockOpen(block._indent)}`;
        block._isWritten = true;
      }
    }

    result += printer._property(indent, values);
    values = [];
  }

  function _build() {
    while (__closeBlock());

    const _result = result;
    result = '';

    return _result;
  }

  function __openBlock({
    _identifier = '',
    _indent = '',
    _isWritten = false,
    _isVirtual = false,
    _allowNesting = false,
    _selectors,
  }: Partial<ICssBlock>) {
    blocks.unshift({ _identifier, _indent, _isWritten, _isVirtual, _allowNesting, _selectors });
  }

  function __closeBlock(): ICssBlock | undefined {
    const block = blocks[0];

    if (block) {
      _property();

      if (block._isWritten) {
        result += printer._blockClose(block._indent);
        block._isWritten = false;
      }

      blocks.shift();
    }

    return block;
  }

  return { _word, _space, _value, _openBlock, _closeBlock, _property, _build };
}

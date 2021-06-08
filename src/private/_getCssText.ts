import { _getConfig } from './_getConfig';
import { Tokens } from './types/Tokens';

interface IBlock {
  _prefix: string;
  _suffix: string;
  _indent: string;
  _conditions: string[];
  _deferred: IBlock[];
  _isParent: boolean;
  _isWritten: boolean;
  _isVirtual: boolean;
}

const singleIndent = '  ';
const reAtRuleBlockNames =
  /^(?:(media|supports|document)|page|font-face|keyframes|viewport|counter-style|font-feature-values|property|color-profile)/;
const blockTemplate: IBlock = {
  _prefix: '',
  _suffix: '',
  _indent: '',
  _conditions: [],
  _deferred: [],
  _isParent: false,
  _isVirtual: false,
  _isWritten: false,
};

export function _getCssText(tokens: Tokens, className?: string): string {
  const { _cssPrinter: printer } = _getConfig();
  const rootSelectors = [className ? '.' + className : ':root'];
  const blocks: IBlock[] = [
    {
      ...blockTemplate,
      _prefix: printer.openBlock('', rootSelectors),
      _suffix: printer.closeBlock(''),
      _conditions: rootSelectors,
    },
  ];

  let indexStart = 0;
  let indexEnd = 0;
  let indexColon: number | null = null;
  let atImports = '';
  let atNamespaces = '';
  let atOtherProps = '';
  let result = '';

  function openBlock() {
    if (tokens[indexStart] === '@' && indexEnd - indexStart > 2) {
      const [isKnown, isConditionalGroup] = tokens[indexStart + 1]?.match(reAtRuleBlockNames) ?? [];
      const at = getTokenValues(indexStart, indexEnd);

      if (isKnown) {
        blocks.unshift({
          ...blockTemplate,
          _prefix: printer.openBlock('', at),
          _suffix: printer.closeBlock(''),
          _conditions: blocks[0]._conditions,
          _deferred: blocks.splice(0),
          _isParent: true,
        });

        isConditionalGroup &&
          blocks.unshift({
            ...blockTemplate,
            _prefix: printer.openBlock(singleIndent, blocks[0]._conditions),
            _suffix: printer.closeBlock(singleIndent),
            _indent: singleIndent,
            _conditions: blocks[0]._conditions,
            _isVirtual: true,
          });
      } else {
        const indent = blocks[0]._indent + singleIndent;

        blocks.unshift({
          ...blockTemplate,
          _prefix: printer.openBlock(indent, at),
          _suffix: printer.closeBlock(indent),
          _indent: indent,
          _deferred: blocks.splice(0),
          _isParent: true,
        });
      }
    } else {
      let parentIndex = 0;

      for (; parentIndex < blocks.length && !blocks[parentIndex]._isParent; parentIndex++);

      const indent = blocks[parentIndex] != null ? blocks[parentIndex]._indent + singleIndent : '';
      const parentSelectors = blocks[0]._conditions;
      const selectors = getTokenValues(indexStart, indexEnd).reduce<string[]>(
        (acc, child) => [
          ...acc,
          ...parentSelectors.map((parent) =>
            /&/.test(child) ? child.replace(/&/g, parent) : parent === ':root' ? child : parent + ' ' + child
          ),
        ],
        []
      );

      blocks.unshift({
        ...blockTemplate,
        _prefix: printer.openBlock(indent, selectors),
        _suffix: printer.closeBlock(indent),
        _indent: indent,
        _conditions: selectors,
        _deferred: blocks.splice(0, parentIndex),
      });
    }
  }

  function closeBlock() {
    if (blocks.length) {
      const closed: IBlock[] = [];
      let block: IBlock;

      do {
        block = blocks.shift() as IBlock;
        closed.push(block);
        blocks.unshift(...block._deferred);
      } while (block._isVirtual && blocks.length);

      closeBlockWrite(closed);
    }
  }

  function property() {
    const isAt = tokens[indexStart] === '@';

    if (isAt) {
      const name = indexEnd - indexStart >= 2 && tokens[indexStart + 1];
      const rule = printer.property('', null, getTokenValues(indexStart, indexEnd));

      switch (name) {
        case 'import':
          atImports += rule;
          break;
        case 'namespace':
          atNamespaces += rule;
          break;
        case 'charset':
          break;
        default:
          atOtherProps += rule;
      }
    } else {
      indexColon = indexColon ?? indexEnd;

      const keys = getTokenValues(indexStart, indexColon);
      const values = getTokenValues(indexColon + 1, indexEnd);

      if (!values.length) {
        return;
      }

      openBlockWrite(blocks);

      keys.forEach((key: string | null) => {
        result += printer.property(blocks[0]._indent + singleIndent, key, values);
      });
    }
  }

  function openBlockWrite(blocks: IBlock[], i = 0) {
    if (blocks[i] && !blocks[i]._isWritten) {
      closeBlockWrite(blocks[i]._deferred);
      openBlockWrite(blocks, i + 1);
      result += blocks[i]._prefix;
      blocks[i]._isWritten = true;
    }
  }

  function closeBlockWrite(blocks: IBlock[], i = blocks.length - 1) {
    if (blocks[i] && blocks[i]._isWritten) {
      closeBlockWrite(blocks, i - 1);
      result += blocks[i]._suffix;
      blocks[i]._isWritten = false;
    }
  }

  function getTokenValues(start: number, end: number) {
    const values: string[] = [];

    let value = '';

    for (let i = start; i < end; ++i) {
      if (tokens[i] !== ',') {
        value += tokens[i];
      } else {
        value && values.push(value);
        value = '';
      }
    }

    value && values.push(value);

    return values;
  }

  for (indexStart = 0, indexEnd = 0; indexEnd < tokens.length; ++indexEnd) {
    switch (tokens[indexEnd]) {
      case ':':
        indexColon = indexColon ?? indexEnd;
        continue;
      case ';': {
        property();
        break;
      }
      case '{': {
        openBlock();
        break;
      }
      case '}': {
        closeBlock();
        break;
      }
      default:
        continue;
    }

    indexStart = indexEnd + 1;
    indexColon = null;
  }

  closeBlock();

  return [atImports, atNamespaces, atOtherProps, result].filter((value) => !!value).join('\n');
}

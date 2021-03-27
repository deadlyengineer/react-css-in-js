import { ICssPrinter } from './types/ICssPrinter';

export const _printerPretty: ICssPrinter = {
  _csv: (values) => values.join(', '),
  _property: (indent, key, value) => indent + key + (value ? ': ' + value : '') + ';\n',
  _openBlock: (indent, selectors) => indent + selectors.join(',\n' + indent) + ' {\n',
  _closeBlock: (indent) => indent + '}\n',
  _concat: (...cssTextChunks: string[]) => cssTextChunks.filter((value) => !!value).join('\n'),
};

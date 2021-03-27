import { ICssPrinter } from './types/ICssPrinter';

export const _printerDefault: ICssPrinter = {
  _csv: (values) => values.join(','),
  _property: (_indent, key, value) => key + (value ? ':' + value : '') + ';',
  _openBlock: (_indent, selectors) => selectors.join(',') + '{',
  _closeBlock: () => '}',
  _concat: (...cssTextChunks: string[]) => cssTextChunks.join(''),
};

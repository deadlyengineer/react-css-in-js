import { ICssPrinter } from './types/ICssPrinter';

export const _printerDefault: ICssPrinter = {
  _identifier: (_indent, values) => values.join(','),
  _blockOpen: () => '{',
  _blockClose: () => '}',
  _property: (_indent, values) => `${values.join(',')};`,
};

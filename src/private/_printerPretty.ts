import { ICssPrinter } from './ICssPrinter';

export const _printerPretty: ICssPrinter = {
  _identifier: (indent, values) => indent + values.join(values[0]?.[0] === '@' ? ', ' : `,\n${indent}`),
  _blockOpen: () => ` {\n`,
  _blockClose: (indent) => `${indent}}\n`,
  _property: (indent, values) => `${indent}${values.join(', ')};\n`,
};

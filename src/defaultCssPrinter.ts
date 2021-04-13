import { ICssPrinter } from './types/ICssPrinter';

/**
 * Default CSS printer.
 */
export const defaultCssPrinter: ICssPrinter = {
  property: (indent, key, values) => indent + (key ? key + ': ' : '') + values.join(', ') + ';\n',
  openBlock: (indent, conditions) => indent + conditions.join(',\n' + indent) + ' {\n',
  closeBlock: (indent) => indent + '}\n',
};

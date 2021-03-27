import { ICssPrinter } from './types/ICssPrinter';

/**
 * Default CSS printer.
 */
export const defaultCssPrinter: ICssPrinter = {
  csv: (values) => values.join(', '),
  property: (indent, key, value) => indent + key + (value ? ': ' + value : '') + ';\n',
  openBlock: (indent, selectors) => indent + selectors.join(',\n' + indent) + ' {\n',
  closeBlock: (indent) => indent + '}\n',
};

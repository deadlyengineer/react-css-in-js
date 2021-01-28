export interface ICssPrinter {
  _csv(values: string[]): string;
  _property(indent: string, key: string, values?: string): string;
  _openBlock(indent: string, selectors: string[]): string;
  _closeBlock(indent?: string): string;
}

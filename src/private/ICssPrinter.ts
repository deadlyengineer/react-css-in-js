export interface ICssPrinter {
  _identifier(indent: string, values: string[]): string;
  _blockOpen(indent: string): string;
  _blockClose(indent: string): string;
  _property(indent: string, values: string[]): string;
}

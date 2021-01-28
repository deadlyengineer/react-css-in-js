export interface ICssBuilder {
  _openBlock(selectors: string[]): void;
  _closeBlock(): void;
  _property(keys: string[], values?: string[]): void;
  _build(): string;
}

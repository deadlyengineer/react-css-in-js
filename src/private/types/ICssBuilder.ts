export interface ICssBuilder {
  _openBlock(token: readonly string[]): void;
  _closeBlock(): void;
  _property(token: readonly string[]): void;
  _build(): string;
}

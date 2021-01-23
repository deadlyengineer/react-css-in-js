export interface ICssBuilder {
  _word(value: string): void;
  _space(): void;
  _value(): void;
  _openBlock(): void;
  _closeBlock(): void;
  _property(): void;
  _build(): string;
}

import { Token } from './Token';

export interface IStyle extends ReadonlyArray<Token> {
  readonly _hash: string;
  readonly _cssText: string;
}

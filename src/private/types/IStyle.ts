import { Token } from './Token';

/**
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export interface IStyle extends ReadonlyArray<Token> {
  readonly h: string;
  readonly t: string;
}

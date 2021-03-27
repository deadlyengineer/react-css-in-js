import { _getTokenValues } from './_getTokenValues';

export function _getTokenProperty(token: readonly string[]): [string[], string[]] | null {
  const i = token.indexOf(':');

  return i <= 0 || i >= token.length - 1
    ? null
    : [_getTokenValues(token.slice(0, i)), _getTokenValues(token.slice(i + 1))];
}

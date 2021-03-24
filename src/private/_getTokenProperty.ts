import { _getTokenValues } from './_getTokenValues';

export function _getTokenProperty(token: readonly string[]): [string[], string[]] | null {
  const i = token.indexOf(':');

  if (i <= 0 || i === token.length - 1) {
    // The property colon doesn't exist, or it's the first/last character.
    return null;
  }

  return [_getTokenValues(token.slice(0, i)), _getTokenValues(token.slice(i + 1))];
}

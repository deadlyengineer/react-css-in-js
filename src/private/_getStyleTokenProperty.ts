import { _getStyleTokenValues } from './_getStyleTokenValues';

export function _getStyleTokenProperty(token: readonly string[]): [string[], string[]] | null {
  // A regular CSS property.
  const i = token.indexOf(':');

  if (i <= 0 || i === token.length - 1) {
    // The property colon doesn't exist, or it's the first/last character.
    return null;
  }

  return [_getStyleTokenValues(token.slice(0, i)), _getStyleTokenValues(token.slice(i + 1))];
}

import { _getConfig } from './_getConfig';
import { _getCssText } from './_getCssText';
import { _getHashDefault } from './_getHashDefault';
import { IStyle } from './types/IStyle';
import { Token } from './types/Token';

/**
 * Decorate a tokens array with memoized hash and cssText getters.
 */
export function _getStyle(tokens: readonly Token[]): IStyle {
  if ('_hash' in tokens && '_cssText' in tokens) {
    return tokens;
  }

  const getHash = _getConfig().customHashFunction ?? _getHashDefault;

  let hash: string | undefined;
  let cssText: string | undefined;

  return Object.assign(tokens, {
    get _hash(): string {
      if (hash == null) {
        hash = getHash(tokens);
      }

      return hash;
    },
    get _cssText(): string {
      if (cssText == null) {
        cssText = _getCssText(tokens);
      }

      return cssText;
    },
  });
}

import { _getConfig } from './_getConfig';
import { _getCssText } from './_getCssText';
import { IStyle } from './types/IStyle';
import { Tokens } from './types/Tokens';

/**
 * Decorate a tokens array with memoized hash and cssText getters.
 */
export function _getStyle(tokens: Tokens | IStyle, overrideTokens?: Tokens): IStyle {
  if (overrideTokens) {
    tokens = [...tokens, ...overrideTokens];
  } else if ('h' in tokens && 't' in tokens) {
    return tokens;
  }

  let hash: string | undefined;
  let cssText: string | undefined;

  return Object.assign(tokens, {
    get h(): string {
      return hash ?? (hash = _getConfig()._hashFunction(tokens));
    },
    get t(): string {
      return cssText ?? (cssText = _getCssText(tokens));
    },
  });
}

import { useMemo } from 'react';
import { _getStyle } from './_getStyle';
import { IStyle } from './types/IStyle';
import { Tokens } from './types/Tokens';

export function _useStyle(tokens: Tokens, overrideTokens?: Tokens): IStyle {
  return useMemo(
    () => _getStyle(overrideTokens && overrideTokens.length ? [...tokens, ...overrideTokens] : tokens),
    [tokens, overrideTokens]
  );
}

import { useMemo } from 'react';
import { _getStyle } from './_getStyle';
import { IStyle } from './types/IStyle';
import { Token } from './types/Token';

export function _useStyle(tokens: readonly Token[], overrideTokens?: readonly Token[]): IStyle {
  return useMemo(() => _getStyle(overrideTokens && overrideTokens.length ? [...tokens, ...overrideTokens] : tokens), [
    tokens,
    overrideTokens,
  ]);
}

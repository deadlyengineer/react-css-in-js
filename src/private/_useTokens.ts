import { useMemo } from 'react';
import { _getTokens } from './_getTokens';
import { Token } from './types/Token';

export function _useTokens(styleText: string, overrideTokens?: readonly Token[]): Token[] {
  const tokens = useMemo(() => _getTokens(styleText), [styleText]);

  return useMemo(() => (overrideTokens && overrideTokens.length ? [...tokens, ...overrideTokens] : tokens), [
    tokens,
    overrideTokens,
  ]);
}

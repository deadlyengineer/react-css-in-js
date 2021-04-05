import { useMemo } from 'react';
import { _getTokens } from './_getTokens';
import { Token } from './types/Token';

export function _useTokens(styleText: string, inheritedTokens?: readonly Token[]): Token[] {
  const tokens = useMemo(() => _getTokens(styleText), [styleText]);

  return useMemo(() => (inheritedTokens && inheritedTokens.length ? [...inheritedTokens, ...tokens] : tokens), [
    tokens,
    inheritedTokens,
  ]);
}

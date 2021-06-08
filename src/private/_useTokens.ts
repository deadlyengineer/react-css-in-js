import { useMemo } from 'react';
import { _getTokens } from './_getTokens';
import { Tokens } from './types/Tokens';

export function _useTokens(styleText: string, inheritedTokens?: Tokens): Tokens {
  const tokens = useMemo(() => _getTokens(styleText), [styleText]);

  return useMemo(
    () => (inheritedTokens && inheritedTokens.length ? [...inheritedTokens, ...tokens] : tokens),
    [tokens, inheritedTokens]
  );
}

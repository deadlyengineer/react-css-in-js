import { useMemo } from 'react';
import { _getStyle } from './_getStyle';
import { _useTokens } from './_useTokens';
import { IStyle } from './types/IStyle';
import { Token } from './types/Token';

export function _useStyle(styleText: string, overrideTokens?: readonly Token[]): IStyle {
  const tokens = _useTokens(styleText, overrideTokens);

  return useMemo(() => _getStyle(tokens), [tokens]);
}

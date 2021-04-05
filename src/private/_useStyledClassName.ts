import { useMemo } from 'react';
import { _useStyle } from './_useStyle';
import { _getStyledClassName } from './_getStyledClassName';
import { StyledClassName } from './types/StyledClassName';
import { Token } from './types/Token';

export const _styledClassNameCache = new Map<string, Required<StyledClassName>>();

export function _useStyledClassName(
  tokens: readonly Token[],
  scope?: string,
  className?: StyledClassName
): string & Required<StyledClassName> {
  const style = _useStyle(tokens, className?._styled?._style);

  return useMemo(
    () =>
      _getStyledClassName(
        style,
        className?._styled?._scope || scope,
        className?._styled ? className?._styled._otherClassName : className
      ),
    [style, scope, className]
  );
}

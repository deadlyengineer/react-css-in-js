import { useMemo } from 'react';
import { _useStyle } from './_useStyle';
import { _getStyledClassName } from './_getStyledClassName';
import { StyledClassName } from './types/StyledClassName';

export const _styledClassNameCache = new Map<string, Required<StyledClassName>>();

export function _useStyledClassName(
  styleText: string,
  scope?: string,
  className?: StyledClassName
): string & Required<StyledClassName> {
  const style = _useStyle(styleText, className?._styled?._style);

  return useMemo(
    () => _getStyledClassName(style, scope, className?._styled ? className?._styled._otherClassName : className),
    [style, scope, className]
  );
}

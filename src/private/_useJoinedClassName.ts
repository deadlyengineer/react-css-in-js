import { useMemo } from 'react';
import { _getJoinedClassName } from './_getJoinedClassName';
import { StyledClassName } from './types/StyledClassName';

export function _useJoinedClassName(
  className0: StyledClassName | undefined,
  className1: StyledClassName | undefined
): StyledClassName | undefined {
  return useMemo(() => _getJoinedClassName(className0, className1), [className0, className1]);
}

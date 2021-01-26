import { useMemo } from 'react';
import { _getConfig } from './_getConfig';

export function _useHash(style: string): string {
  return useMemo(() => {
    const { getHash } = _getConfig();

    return getHash(
      style.replace(/\\[\s\S]|(\s+|\/\/*(?:[\s\S]*?\*\/|[\s\S]*$))|(['"])(?:[\s\S]*?\1|[\s\S]*$)/g, (match, blank) => {
        return blank ? '' : match;
      })
    );
  }, [style]);
}

import { useEffect, useRef } from 'react';
import { _getConfig } from './_getConfig';
import { _styleRefCounts } from './_styleRefCounts';

export function _useStyle(key: string, cssText: string): boolean {
  const { styleManager } = _getConfig();
  const keyRef = useRef('');
  const cssTextRef = useRef('');

  if (keyRef.current !== key || cssTextRef.current !== cssText) {
    keyRef.current = key;
    cssTextRef.current = cssText;
    const refCount = _styleRefCounts.get(key) ?? 0;

    _styleRefCounts.set(key, refCount + 1);

    if (refCount === 0) {
      styleManager?.register(key, cssText);
    }
  }

  useEffect(
    () => () => {
      const key = keyRef.current;
      const newRefCount = (_styleRefCounts.get(key) ?? 0) - 1;

      if (newRefCount <= 0) {
        _styleRefCounts.delete(key);
        styleManager?.unregister(key);
      } else {
        _styleRefCounts.set(key, newRefCount);
      }
    },
    []
  );

  return styleManager != null;
}

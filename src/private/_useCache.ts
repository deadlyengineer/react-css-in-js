import { useEffect } from 'react';
import { _getCache } from './_getCache';

export function _useCache(key: string, cssText: string): boolean {
  const cache = _getCache();

  useEffect(() => {
    const refCount = cache.refCounts.get(key) ?? 0;

    cache.refCounts.set(key, refCount + 1);

    if (refCount === 0) {
      cache.manager?.register(key, cssText);
    }

    return () => {
      const newRefCount = (cache.refCounts.get(key) ?? 0) - 1;

      if (newRefCount <= 0) {
        cache.refCounts.delete(key);
        cache.manager?.unregister(key);
      } else {
        cache.refCounts.set(key, newRefCount);
      }
    };
  }, [key, cssText]);

  return cache.manager != null;
}

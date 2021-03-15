import { _getConfig } from './_getConfig';
import { _styleRefCounts } from './_styleRefCounts';
import { _useRenderEffect } from './_useRenderEffect';

export function _useStyle(cacheKey: string, cssText: string): boolean {
  const { customStyleManager } = _getConfig();

  _useRenderEffect(() => {
    const count = _styleRefCounts.get(cacheKey) ?? 0;

    _styleRefCounts.set(cacheKey, count + 1);

    if (count === 0) {
      customStyleManager?.register(cacheKey, cssText);
    }

    return () => {
      const nextCount = (_styleRefCounts.get(cacheKey) ?? 0) - 1;

      if (nextCount <= 0) {
        _styleRefCounts.delete(cacheKey);
        customStyleManager?.unregister(cacheKey);
      } else {
        _styleRefCounts.set(cacheKey, nextCount);
      }
    };
  }, [cacheKey, cssText]);

  return customStyleManager != null;
}

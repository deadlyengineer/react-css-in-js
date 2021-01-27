import { _getConfig } from './_getConfig';
import { _styleRefCounts } from './_styleRefCounts';
import { _useRenderEffect } from './_useRenderEffect';

export function _useStyle(key: string, cssText: string): boolean {
  const { customStyleManager } = _getConfig();

  _useRenderEffect(() => {
    const count = _styleRefCounts.get(key) ?? 0;

    _styleRefCounts.set(key, count + 1);

    if (count === 0) {
      customStyleManager?.register(key, cssText);
    }

    return () => {
      const nextCount = (_styleRefCounts.get(key) ?? 0) - 1;

      if (nextCount <= 0) {
        _styleRefCounts.delete(key);
        customStyleManager?.unregister(key);
      } else {
        _styleRefCounts.set(key, nextCount);
      }
    };
  }, [key, cssText]);

  return customStyleManager != null;
}

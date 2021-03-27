import { _styleAttributeName } from './private/_constants';
import { IStyleManager } from './types/IStyleManager';

const cache = new Map<string, HTMLStyleElement>();

/**
 * Default style manager.
 */
export const defaultStyleManager: IStyleManager = {
  register(cacheKey, cssText, replacedCacheKey) {
    const style = document.createElement('style');
    const replacedStyle = replacedCacheKey != null ? cache.get(replacedCacheKey) : null;

    style.setAttribute(_styleAttributeName, cacheKey);
    style.textContent = cssText;
    document.head.insertBefore(style, replacedStyle?.nextSibling ?? null);
    cache.set(cacheKey, style);
  },
  unregister(cacheKey) {
    const style = cache.get(cacheKey);

    if (style) {
      cache.delete(cacheKey);
      style.remove();
    }
  },
};

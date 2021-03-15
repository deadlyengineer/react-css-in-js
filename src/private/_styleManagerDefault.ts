import { _styleAttributeName } from './_constants';
import { IStyleManager } from '../types/IStyleManager';

const cache = new Map<string, HTMLStyleElement>();

export const _styleManagerDefault: IStyleManager = {
  register(cacheKey, cssText) {
    const style = document.createElement('style');

    style.setAttribute(_styleAttributeName, cacheKey);
    style.textContent = cssText;
    cache.set(cacheKey, style);
    document.head.append(style);
  },
  unregister(cacheKey) {
    const style = cache.get(cacheKey);

    if (style) {
      style.remove();
      cache.delete(cacheKey);
    }
  },
  hydrate(styles) {
    document.head.append(
      ...styles.map(({ cacheKey, element }) => {
        cache.set(cacheKey, element);
        return element;
      })
    );
  },
};

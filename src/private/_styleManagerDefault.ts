import { _styleAttributeName } from './_styleAttributeName';
import { IStyleManager } from '../types/IStyleManager';

const cache = new Map<string, HTMLStyleElement>();

export const _styleManagerDefault: IStyleManager = {
  register(key, cssText) {
    const style = document.createElement('style');

    style.setAttribute(_styleAttributeName, key);
    style.textContent = cssText;
    cache.set(key, style);
    document.head.append(style);
  },
  unregister(key) {
    const style = cache.get(key);

    if (style) {
      style.remove();
      cache.delete(key);
    }
  },
  hydrate(styles) {
    document.head.append(
      ...styles.map(({ key, element }) => {
        cache.set(key, element);
        return element;
      })
    );
  },
};

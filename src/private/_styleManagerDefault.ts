/* eslint-disable @typescript-eslint/no-explicit-any */
import { _styleAttributeName } from './_styleAttributeName';
import { IStyleManager } from '../IStyleManager';

const unregistered: string[] = [];
const cache = new Map<string, HTMLStyleElement>();

export const _styleManagerDefault: IStyleManager = {
  register(key, cssText) {
    const style = document.createElement('style');
    const unregisteredIndex = unregistered.indexOf(key);

    if (unregisteredIndex >= 0) {
      unregistered.splice(unregisteredIndex, 1);
    }

    style.setAttribute(_styleAttributeName, key);
    style.textContent = cssText;
    cache.set(key, style);
    document.head.append(style);
  },
  unregister(key) {
    const style = cache.get(key);

    if (style) {
      unregistered.push(key);

      while (unregistered.length > 1000) {
        const unregisteredKey = unregistered.shift() as string;
        const style = cache.get(unregisteredKey);

        if (style) {
          style.remove();
          cache.delete(unregisteredKey);
        }
      }
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

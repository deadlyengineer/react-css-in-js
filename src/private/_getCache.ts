import { _styleManagerDefault } from './_styleManagerDefault';
import { _styleAttributeName } from './_styleAttributeName';
import { _getConfig } from './_getConfig';
import { ICache } from './ICache';
import { IStyleDehydrated } from '../IStyleDehydrated';
import { IStyleManager } from '../IStyleManager';

let cache: ICache | undefined;

export function _getCache(): ICache {
  if (cache) {
    return cache;
  }

  const { styleManager, isBrowser } = _getConfig();
  const refCounts = new Map();

  let manager: IStyleManager | null;

  if (typeof styleManager !== 'string') {
    manager = styleManager;
  } else if (styleManager !== 'none' && isBrowser) {
    manager = _styleManagerDefault;
  } else {
    manager = null;
  }

  if (manager) {
    const styles = Array.from(document.querySelectorAll<HTMLStyleElement>(`body style[${_styleAttributeName}]`)).reduce<
      IStyleDehydrated[]
    >((acc, element) => {
      const key = element.getAttribute(_styleAttributeName);

      if (key) {
        const refCount = refCounts.get(key) ?? 0;

        refCounts.set(key, refCount + 1);

        if (refCount === 0) {
          acc.push({ key, element });
        }
      }

      return acc;
    }, []);

    manager.hydrate(styles);
  }

  return (cache = { manager, refCounts });
}

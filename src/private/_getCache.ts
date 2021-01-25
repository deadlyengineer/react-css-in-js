import { _config } from './_config';
import { _styleManagerDefault } from './_styleManagerDefault';
import { _styleAttributeName } from './_styleAttributeName';
import { IStyleManager } from '../IStyleManager';
import { IStyleDehydrated } from '../IStyleDehydrated';
import { ICache } from './ICache';

let cache: ICache | undefined;

export function _getCache(): ICache {
  if (cache) {
    return cache;
  }

  _config._locked = true;

  const configStyleManager = _config._current.styleManager;
  const refCounts = new Map();

  let manager: IStyleManager | null;

  if (typeof configStyleManager !== 'string') {
    manager = configStyleManager;
  } else if (configStyleManager !== 'none' && _config._current.isBrowser) {
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

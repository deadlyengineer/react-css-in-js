import { _getConfig } from './_getConfig';
import { _styleManagerDefault } from './_styleManagerDefault';
import { _styleAttributeName } from './_styleAttributeName';
import { _styleRefCounts } from './_styleRefCounts';
import { IStyleDehydrated } from '../IStyleDehydrated';
import { IStyleManager } from '../IStyleManager';

const isBrowser = typeof document !== 'undefined';
const { styleManager } = _getConfig();

let _styleManager: IStyleManager | null;

if (typeof styleManager !== 'string') {
  _styleManager = styleManager;
} else if (styleManager !== 'none' && isBrowser) {
  _styleManager = _styleManagerDefault;
} else {
  _styleManager = null;
}

if (isBrowser && _styleManager) {
  const dehydrated = Array.from(document.querySelectorAll<HTMLStyleElement>(`style[${_styleAttributeName}]`)).reduce<
    IStyleDehydrated[]
  >((acc, element) => {
    const key = element.getAttribute(_styleAttributeName) as string;
    const refCount = _styleRefCounts.get(key) ?? 0;

    _styleRefCounts.set(key, refCount + 1);

    if (refCount === 0) {
      acc.push({ key, element });
    } else {
      element.remove();
    }

    return acc;
  }, []);

  _styleManager.hydrate(dehydrated);
}

export { _styleManager };

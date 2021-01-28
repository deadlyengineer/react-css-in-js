import { _config } from './_config';
import { _styleManagerDefault } from './_styleManagerDefault';
import { _styleAttributeName } from './_styleAttributeName';
import { _styleRefCounts } from './_styleRefCounts';
import { IStyleConfig } from '../types/IStyleConfig';
import { IStyleDehydrated } from '../types/IStyleDehydrated';

function isBrowser() {
  return typeof document !== 'undefined';
}

let dehydrated: IStyleDehydrated[] | undefined;

if (isBrowser()) {
  dehydrated = Array.from(document.querySelectorAll<HTMLStyleElement>('style[' + _styleAttributeName + ']')).reduce<
    IStyleDehydrated[]
  >((acc, element) => {
    const key = element.getAttribute(_styleAttributeName) as string;
    const refCount = _styleRefCounts.get(key) ?? 0;

    _styleRefCounts.set(key, refCount + 1);

    if (refCount === 0) {
      acc.push({ key, element });
    }

    element.remove();

    return acc;
  }, []);
}

let config: IStyleConfig | undefined;

export function _getConfig(): Readonly<IStyleConfig> {
  if (!config) {
    _getConfig._locked = true;

    let { customStyleManager } = _config;

    if (!customStyleManager && isBrowser()) {
      customStyleManager = _styleManagerDefault;
    }

    config = { ..._config, customStyleManager: customStyleManager };

    if (dehydrated && customStyleManager) {
      customStyleManager.hydrate(dehydrated);
    }
  }

  return config;
}
_getConfig._locked = false;

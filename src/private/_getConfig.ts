import { _isBrowser, _styleAttributeName } from './_constants';
import { _config } from './_config';
import { _styleManagerDefault } from './_styleManagerDefault';
import { _styleRefCounts } from './_styleRefCounts';
import { IStyleConfig } from '../types/IStyleConfig';
import { IStyleDehydrated } from '../types/IStyleDehydrated';

let dehydrated: IStyleDehydrated[] | undefined;

if (_isBrowser) {
  dehydrated = Array.from(document.querySelectorAll<HTMLStyleElement>('style[' + _styleAttributeName + ']')).reduce<
    IStyleDehydrated[]
  >((acc, element) => {
    const cacheKey = element.getAttribute(_styleAttributeName) as string;
    const refCount = _styleRefCounts.get(cacheKey) ?? 0;

    _styleRefCounts.set(cacheKey, refCount + 1);

    if (refCount === 0) {
      acc.push({ cacheKey: cacheKey, element });
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

    if (!customStyleManager && _isBrowser) {
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

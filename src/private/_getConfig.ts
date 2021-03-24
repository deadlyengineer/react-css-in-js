import { _config } from './_globals';
import { _isBrowser, _styleAttributeName } from './_constants';
import { _getStyleRefCounter } from './_getStyleRefCounter';
import { IStyleConfig } from '../types/IStyleConfig';
import { IStyleDehydrated } from '../types/IStyleDehydrated';

const refCounter = _getStyleRefCounter();

let dehydrated: IStyleDehydrated[] = [];

if (_isBrowser) {
  dehydrated = Array.from(document.querySelectorAll<HTMLStyleElement>('style[' + _styleAttributeName + ']')).reduce<
    IStyleDehydrated[]
  >((acc, element) => {
    const cacheKey = element.getAttribute(_styleAttributeName) as string;

    if (refCounter.ref(cacheKey)) {
      acc.push({ cacheKey: cacheKey, element });
    }

    element.remove();

    return acc;
  }, []);
}

export function _getConfig(): Readonly<IStyleConfig> {
  if (!_getConfig._locked) {
    _getConfig._locked = true;
    _config.customStyleManager?.hydrate(dehydrated);
  }

  return _config;
}
_getConfig._locked = false;

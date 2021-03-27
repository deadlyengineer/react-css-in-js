import { _config } from './_globals';
import { _isBrowser, _styleAttributeName } from './_constants';
import { _getStyleRefCounter } from './_getStyleRefCounter';
import { IStyleConfig } from '../types/IStyleConfig';
import { defaultStyleManager } from '../defaultStyleManager';

const refCounter = _getStyleRefCounter();

let dehydrated: [string, string][] = [];

if (_isBrowser) {
  dehydrated = Array.from(document.querySelectorAll<HTMLStyleElement>('style[' + _styleAttributeName + ']')).reduce<
    [string, string][]
  >((acc, element) => {
    const cacheKey = element.getAttribute(_styleAttributeName) as string;

    if (refCounter.ref(cacheKey)) {
      acc.push([cacheKey, element.textContent ?? '']);
    }

    element.remove();

    return acc;
  }, []);
}

export function _getConfig(): Readonly<IStyleConfig> {
  if (!_getConfig._locked) {
    _getConfig._locked = true;

    if (_isBrowser || _config.customStyleManager) {
      const styleManager = _config.customStyleManager ?? defaultStyleManager;

      dehydrated.forEach(([cacheKey, cssText]) => styleManager.register(cacheKey, cssText));
    }
  }

  return _config;
}
_getConfig._locked = false;

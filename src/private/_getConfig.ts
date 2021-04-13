import { _globals } from './_globals';
import { _isBrowser, _styleAttributeName } from './_constants';
import { _getStyleRefCounter } from './_getStyleRefCounter';
import { defaultStyleManager } from '../defaultStyleManager';
import { defaultCssPrinter } from '../defaultCssPrinter';
import { defaultHashFunction } from '../defaultHashFunction';
import { ICssPrinter } from '../types/ICssPrinter';
import { IStyleManager } from '../types/IStyleManager';

export interface _IStyleConfig {
  readonly _cssPrinter: ICssPrinter;
  readonly _styleManager: IStyleManager | undefined;
  readonly _hashFunction: (tokens: readonly string[]) => string;
}

export function _getConfig(): Readonly<_IStyleConfig> {
  if (!instance) {
    instance = {
      _cssPrinter: _globals.c.customCssPrinter ?? defaultCssPrinter,
      _styleManager: _globals.c.customStyleManager ?? _isBrowser ? defaultStyleManager : undefined,
      _hashFunction: _globals.c.customHashFunction ?? defaultHashFunction,
    };

    if (instance._styleManager) {
      const styleManager = instance._styleManager;
      dehydrated.forEach(([cacheKey, cssText]) => styleManager.register(cacheKey, cssText));
    }
  }

  return instance;
}
_getConfig._locked = false;

const refCounter = _getStyleRefCounter();

let instance: _IStyleConfig;
let dehydrated: [string, string][] = [];

if (_isBrowser) {
  dehydrated = Array.from(
    document.body.querySelectorAll<HTMLStyleElement>('style[' + _styleAttributeName + ']')
  ).reduce<[string, string][]>((acc, element) => {
    const cacheKey = element.getAttribute(_styleAttributeName) as string;

    refCounter.ref(cacheKey) && acc.push([cacheKey, element.textContent ?? '']);
    element.remove();

    return acc;
  }, []);
}

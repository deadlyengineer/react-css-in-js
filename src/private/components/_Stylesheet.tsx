import React, { ReactElement, useLayoutEffect, useRef } from 'react';
import { _isBrowser, _styleAttributeName } from '../_constants';
import { _getStyleCacheKey } from '../_getStyleCacheKey';
import { _getStyleRefCounter } from '../_getStyleRefCounter';
import { _getConfig } from '../_getConfig';

const refCounter = _getStyleRefCounter();

export interface IStylesheetProps {
  _scope: string | undefined;
  _hash: string;
  _cssText: string;
}

export function _Stylesheet({ _scope, _hash, _cssText }: IStylesheetProps): ReactElement | null {
  const { _styleManager } = _getConfig();
  const cacheKey = _cssText ? _getStyleCacheKey(_scope, _hash) : undefined;

  if (!_isBrowser || !_styleManager) {
    // Rendering server side.

    if (cacheKey && refCounter.ref(cacheKey)) {
      if (!_styleManager) {
        return <style {...{ [_styleAttributeName]: cacheKey }}>{_cssText}</style>;
      }

      _styleManager.register(cacheKey, _cssText);
    }
  } else {
    // Rendering client side (or server side with a style manager override).

    const cacheKeyRef = useRef<string>();

    useLayoutEffect(() => {
      if (cacheKey) {
        refCounter.ref(cacheKey) && _styleManager.register(cacheKey, _cssText, cacheKeyRef.current);
      }

      cacheKeyRef.current = cacheKey;

      return cacheKey
        ? () => {
            requestAnimationFrame(() => refCounter.unref(cacheKey) && _styleManager.unregister(cacheKey));
          }
        : undefined;
    }, [cacheKey]);
  }

  return null;
}
_Stylesheet.displayName = 'Stylesheet';

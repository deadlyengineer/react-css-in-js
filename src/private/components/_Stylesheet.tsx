import React, { ReactElement, useEffect, useRef } from 'react';
import { _styleAttributeName } from '../_constants';
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
  const cacheKeyRef = useRef<string>();
  const gc = useRef<() => void>();

  if (!_styleManager) {
    // Rendering server side.

    return cacheKey && refCounter.ref(cacheKey) ? (
      <style {...{ [_styleAttributeName]: cacheKey }}>{_cssText}</style>
    ) : null;
  }

  // Rendering client side (or server side with a style manager override).

  if (cacheKey !== cacheKeyRef.current) {
    gc.current?.();
    gc.current = undefined;

    if (cacheKey) {
      refCounter.ref(cacheKey) && _styleManager.register(cacheKey, _cssText, cacheKeyRef.current);
      gc.current = () => requestAnimationFrame(() => refCounter.unref(cacheKey) && _styleManager.unregister(cacheKey));
    }

    cacheKeyRef.current = cacheKey;
  }

  useEffect(() => () => gc.current?.(), []);

  return null;
}
_Stylesheet.displayName = 'Stylesheet';

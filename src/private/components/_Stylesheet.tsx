import React, { memo, ReactElement, useEffect, useRef } from 'react';
import { _styleAttributeName } from '../_constants';
import { _getStyleCacheKey } from '../_getStyleCacheKey';
import { _getStyleRefCounter } from '../_getStyleRefCounter';
import { _getConfig } from '../_getConfig';

const refCounter = _getStyleRefCounter();

export interface IStylesheetProps {
  scope: string | undefined;
  hash: string;
  cssText: string;
}

function Stylesheet({ scope, hash, cssText }: IStylesheetProps): ReactElement | null {
  const { _styleManager } = _getConfig();
  const cacheKey = cssText ? _getStyleCacheKey(scope, hash) : undefined;
  const cacheKeyRef = useRef<string>();
  const gc = useRef<() => void>();

  if (!_styleManager) {
    // Rendering server side.

    return cacheKey && refCounter.ref(cacheKey) ? (
      <style {...{ [_styleAttributeName]: cacheKey }}>{cssText}</style>
    ) : null;
  }

  // Rendering client side (or server side with a style manager override).

  if (cacheKey !== cacheKeyRef.current) {
    gc.current?.();
    gc.current = undefined;

    if (cacheKey) {
      if (refCounter.ref(cacheKey)) {
        _styleManager.register(cacheKey, cssText, cacheKeyRef.current);
      }

      gc.current = () => requestAnimationFrame(() => refCounter.unref(cacheKey) && _styleManager.unregister(cacheKey));
    }

    cacheKeyRef.current = cacheKey;
  }

  useEffect(() => () => gc.current?.(), []);

  return null;
}

export const _Stylesheet = memo(Stylesheet);
_Stylesheet.displayName = 'Stylesheet';

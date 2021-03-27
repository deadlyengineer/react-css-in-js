import React, { memo, ReactElement, useEffect, useRef } from 'react';
import { _isBrowser, _styleAttributeName } from '../_constants';
import { _getStyleCacheKey } from '../_getStyleCacheKey';
import { _getStyleRefCounter } from '../_getStyleRefCounter';
import { _getConfig } from '../_getConfig';
import { defaultStyleManager } from '../../defaultStyleManager';

const refCounter = _getStyleRefCounter();

export interface IStylesheetProps {
  scope: string | undefined;
  hash: string;
  cssText: string;
}

function Stylesheet({ scope, hash, cssText }: IStylesheetProps): ReactElement | null {
  const { customStyleManager = _isBrowser ? defaultStyleManager : null } = _getConfig();

  if (!customStyleManager) {
    // Rendering server side.

    const cacheKey = cssText ? _getStyleCacheKey(scope, hash) : undefined;

    if (cacheKey && refCounter.ref(cacheKey)) {
      return <style {...{ [_styleAttributeName]: cacheKey }}>{cssText}</style>;
    }
  } else {
    // Rendering client side, or server side with a style manager override.

    const cacheKeyRef = useRef<string | undefined>();
    const replacedCacheKey = cacheKeyRef.current;
    const cacheKey = cssText ? _getStyleCacheKey(scope, hash) : undefined;

    cacheKeyRef.current = cacheKey;

    if (cacheKey && cacheKey !== replacedCacheKey && refCounter.ref(cacheKey)) {
      customStyleManager.register(cacheKey, cssText, replacedCacheKey);

      if (replacedCacheKey) {
        requestAnimationFrame(() => {
          customStyleManager.unregister(replacedCacheKey);
        });
      }
    }

    useEffect(
      () => () => {
        if (cacheKeyRef.current && refCounter.unref(cacheKeyRef.current)) {
          customStyleManager.unregister(cacheKeyRef.current);
        }
      },
      []
    );
  }

  return null;
}

export const _Stylesheet = memo(Stylesheet);

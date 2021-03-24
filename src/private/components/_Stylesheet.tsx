import React, { memo, ReactElement, useEffect, useRef } from 'react';
import { _styleAttributeName } from '../_constants';
import { _getStyleCacheKey } from '../_getStyleCacheKey';
import { _getStyleRefCounter } from '../_getStyleRefCounter';
import { _getConfig } from '../_getConfig';

const refCounter = _getStyleRefCounter();

export interface _IStylesheetProps {
  scope: string | undefined;
  hash: string;
  cssText: string;
}

function _StylesheetBase({ scope, hash, cssText }: _IStylesheetProps): ReactElement | null {
  const { customStyleManager } = _getConfig();

  if (!customStyleManager) {
    // Rendering server side.

    const cacheKey = _getStyleCacheKey(scope, hash);

    if (refCounter.ref(cacheKey)) {
      return <style {...{ [_styleAttributeName]: cacheKey }}>{cssText}</style>;
    }
  } else {
    // Rendering client side, or server side with a style manager override.

    const cacheKeyRef = useRef<string | undefined>();
    const cacheKey = _getStyleCacheKey(scope, hash);

    if (cacheKey !== cacheKeyRef.current && refCounter.ref(cacheKey)) {
      customStyleManager.register(cacheKey, cssText);
    }

    cacheKeyRef.current = cacheKey;

    useEffect(
      () => () => {
        if (cacheKey != null && refCounter.unref(cacheKey)) {
          customStyleManager.unregister(cacheKey);
        }
      },
      [cacheKey]
    );
  }

  return null;
}
_StylesheetBase.displayName = '_Stylesheet';

export const _Stylesheet = memo(_StylesheetBase);

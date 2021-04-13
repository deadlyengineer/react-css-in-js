import { useLayoutEffect, useRef } from 'react';
import { _getStyleRefCounter } from '../_getStyleRefCounter';
import { IStyleManager } from '../../types/IStyleManager';
import { defaultStyleManager } from '../../defaultStyleManager';
import { _getInternalComponent } from '../_getInternalComponent';

const refCounter = _getStyleRefCounter();

export interface _IStylesheetBrowser {
  _styleManager: IStyleManager | undefined;
  _cacheKey: string | undefined;
  _cssText: string;
}

export const _StylesheetBrowser = _getInternalComponent<_IStylesheetBrowser>(
  'sb',
  ({ _styleManager = defaultStyleManager, _cacheKey, _cssText }) => {
    const cacheKeyRef = useRef<string>();

    useLayoutEffect(() => {
      if (_cacheKey) {
        refCounter.ref(_cacheKey) && _styleManager.register(_cacheKey, _cssText, cacheKeyRef.current);
      }

      cacheKeyRef.current = _cacheKey;

      return _cacheKey
        ? () => {
            requestAnimationFrame(() => refCounter.unref(_cacheKey) && _styleManager.unregister(_cacheKey));
          }
        : undefined;
    }, [_styleManager, _cacheKey, _cssText]);
  }
);

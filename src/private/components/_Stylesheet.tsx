import React from 'react';
import { _StylesheetServer } from './_StylesheetServer';
import { _StylesheetBrowser } from './_StylesheetBrowser';
import { _isBrowser } from '../_constants';
import { _getInternalComponent } from '../_getInternalComponent';
import { _getStyleCacheKey } from '../_getStyleCacheKey';
import { _getConfig } from '../_getConfig';

export interface _IStylesheetProps {
  _scope: string | undefined;
  _hash: string;
  _cssText: string;
}

export const _Stylesheet = _getInternalComponent<_IStylesheetProps>('s', ({ _scope, _hash, _cssText }) => {
  const Stylesheet = _isBrowser ? _StylesheetBrowser : _StylesheetServer;

  return (
    <Stylesheet
      _styleManager={_getConfig()._styleManager}
      _cacheKey={_cssText ? _getStyleCacheKey(_scope, _hash) : undefined}
      _cssText={_cssText}
    />
  );
});

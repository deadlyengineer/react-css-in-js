import React from 'react';
import { _styleAttributeName } from '../_constants';
import { _getStyleRefCounter } from '../_getStyleRefCounter';
import { IStyleManager } from '../../types/IStyleManager';
import { _getInternalComponent } from '../_getInternalComponent';

const refCounter = _getStyleRefCounter();

export interface _IStylesheetServerProps {
  _styleManager: IStyleManager | undefined;
  _cacheKey: string | undefined;
  _cssText: string;
}
export const _StylesheetServer = _getInternalComponent<_IStylesheetServerProps>(
  'ss',
  ({ _styleManager, _cacheKey, _cssText }) => {
    if (_cacheKey && refCounter.ref(_cacheKey)) {
      if (!_styleManager) {
        return <style {...{ [_styleAttributeName]: _cacheKey }}>{_cssText}</style>;
      }

      _styleManager.register(_cacheKey, _cssText);
    }
  }
);

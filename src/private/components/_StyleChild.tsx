import React from 'react';
import { _getInternalComponent } from '../_getInternalComponent';
import { _useStyle } from '../_useStyle';
import { _useTokens } from '../_useTokens';
import { _Stylesheet } from './_Stylesheet';

export interface _IStyleChildProps {
  _scope: string | undefined;
  _styleText: string;
}

export const _StyleChild = _getInternalComponent<_IStyleChildProps>('c', ({ _scope, _styleText }) => {
  const tokens = _useTokens(_styleText);
  const style = _useStyle(tokens);

  return style.length > 0 ? <_Stylesheet _scope={_scope} _hash={style.h} _cssText={style.t} /> : null;
});

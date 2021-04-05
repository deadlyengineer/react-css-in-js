import React, { ReactElement } from 'react';
import { _useStyle } from '../_useStyle';
import { _useTokens } from '../_useTokens';
import { _Stylesheet } from './_Stylesheet';

export interface IStyleChildProps {
  _scope: string | undefined;
  _styleText: string;
}

export function _StyleChild({ _scope, _styleText }: IStyleChildProps): ReactElement | null {
  const tokens = _useTokens(_styleText);
  const style = _useStyle(tokens);

  return style.length > 0 ? <_Stylesheet _scope={_scope} _hash={style._hash} _cssText={style._cssText} /> : null;
}
_StyleChild.displayName = 'StyleChild';

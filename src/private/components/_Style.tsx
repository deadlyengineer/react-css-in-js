import React, { ReactElement } from 'react';
import { _useStyle } from '../_useStyle';
import { _Stylesheet } from './_Stylesheet';

export interface _IStyleProps {
  scope: string | undefined;
  styleText: string;
}

export function _Style({ scope, styleText }: _IStyleProps): ReactElement | null {
  const style = _useStyle(styleText);

  return style.length > 0 ? <_Stylesheet scope={scope} hash={style._hash} cssText={style._cssText} /> : null;
}
_Style.displayName = '_Style';

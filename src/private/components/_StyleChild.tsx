import React, { ReactElement } from 'react';
import { _useStyle } from '../_useStyle';
import { _Stylesheet } from './_Stylesheet';

export interface IStyleChildProps {
  scope: string | undefined;
  styleText: string;
}

export function _StyleChild({ scope, styleText }: IStyleChildProps): ReactElement | null {
  const style = _useStyle(styleText);

  return style.length > 0 ? <_Stylesheet scope={scope} hash={style._hash} cssText={style._cssText} /> : null;
}
_StyleChild.displayName = 'StyleChild';

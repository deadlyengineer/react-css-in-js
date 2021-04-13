import React, { cloneElement, ReactElement, useMemo } from 'react';
import { _Stylesheet } from './_Stylesheet';
import { _metaKey } from '../_constants';
import { _getInternalComponent } from '../_getInternalComponent';
import { _getStyle } from '../_getStyle';
import { _getStyledClassName } from '../_getStyledClassName';
import { StyledClassName } from '../types/StyledClassName';
import { IStyle } from '../types/IStyle';

export interface _IStyledChildProps {
  _className: StyledClassName | undefined;
  _child: ReactElement;
}

export const _StyledChild = _getInternalComponent<_IStyledChildProps>('wc', ({ _className, _child }) => {
  const childClassName: StyledClassName | undefined = _child.props.className;
  const joinedClassName: StyledClassName | undefined = useMemo(() => {
    if (_className == null || childClassName == null) {
      return _className ?? childClassName;
    }

    const classNameMeta = _className[_metaKey];
    const childClassNameMeta = childClassName[_metaKey];

    const style: IStyle | undefined = classNameMeta
      ? childClassNameMeta
        ? _getStyle([...classNameMeta.s, ...childClassNameMeta.s])
        : classNameMeta.s
      : childClassNameMeta?.s;
    const scope = classNameMeta?.n ?? childClassNameMeta?.n;
    const otherClassNames =
      [classNameMeta ? classNameMeta.c : _className, childClassNameMeta ? childClassNameMeta.c : childClassName]
        .filter((className) => !!className)
        .join(' ') || undefined;

    return style ? _getStyledClassName(style, scope, otherClassNames) : otherClassNames;
  }, [_className, childClassName]);

  const meta = joinedClassName?.[_metaKey];

  return (
    <>
      {meta && meta.s.length > 0 && <_Stylesheet _scope={meta.n} _hash={meta.s.h} _cssText={meta.t} />}
      {cloneElement(_child, { className: joinedClassName })}
    </>
  );
});

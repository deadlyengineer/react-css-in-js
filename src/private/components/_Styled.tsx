import React, { Children, isValidElement, ReactElement, ReactNode } from 'react';
import { _Css } from './_Css';
import { _StyledWrapper } from './_StyledWrapper';
import { _useStyledClassName } from '../_useStyledClassName';
import { StyledClassName } from '../types/StyledClassName';

export interface _IStyledProps {
  scope?: string;
  styleText?: string;
  className?: StyledClassName;
  children: ReactNode;
}

export function _Styled({ scope, styleText, className, children }: _IStyledProps): ReactElement {
  // HACK: While this component is mounted, styleText will either
  // always be nullish or always be non-nullish. That's why this hook
  // can be used conditionally.
  const styledClassName = styleText == null ? className : _useStyledClassName(styleText, scope, className);
  const arrChildren = Children.toArray(children);
  const newChildren: (React.ReactChild | React.ReactFragment | React.ReactPortal)[] = [];

  let child: React.ReactChild | React.ReactFragment | React.ReactPortal | undefined;

  while (null != (child = arrChildren.shift())) {
    if (typeof child === 'string' || typeof child === 'number') {
      child = <span>{child}</span>;
    }

    if (!isValidElement(child)) {
      newChildren.push(child);
      continue;
    }

    if (child.type === _Css) {
      newChildren.push(
        <_Styled key={child.key} scope={scope} styleText={child.props.value} className={styledClassName}>
          {arrChildren}
        </_Styled>
      );
      break;
    }

    newChildren.push(<_StyledWrapper key={child.key} className={styledClassName} child={child} />);
  }

  return <>{newChildren}</>;
}
_Styled.displayName = '_Styled';

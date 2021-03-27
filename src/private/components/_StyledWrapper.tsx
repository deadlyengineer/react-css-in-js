import React, { Children, isValidElement, ReactElement, ReactNode } from 'react';
import { _StyledChild } from './_StyledChild';
import { _useStyledClassName } from '../_useStyledClassName';
import { _getCssElementStyleText } from '../_getCssComponentValue';
import { StyledClassName } from '../types/StyledClassName';

export interface IStyledWrapperProps {
  scope?: string;
  styleText?: string;
  className?: StyledClassName;
  children: ReactNode;
}

export function _StyledWrapper({ scope, styleText, className, children }: IStyledWrapperProps): ReactElement {
  // HACK: While this component is mounted, styleText will either
  // always be nullish or always be non-nullish. That's why this hook
  // can be used conditionally.
  const styledClassName = styleText == null ? className : _useStyledClassName(styleText, scope, className);
  const arrChildren = Children.toArray(children);
  const newChildren: (React.ReactChild | React.ReactFragment | React.ReactPortal)[] = [];

  let child: React.ReactChild | React.ReactFragment | React.ReactPortal | undefined;

  while (null != (child = arrChildren.shift())) {
    let element: ReactElement;

    if (typeof child === 'string' || typeof child === 'number') {
      element = <span>{child}</span>;
    } else if (isValidElement(child)) {
      const styleText = _getCssElementStyleText(child);

      if (styleText != null) {
        newChildren.push(
          <_StyledWrapper key={child.key} scope={scope} styleText={styleText} className={styledClassName}>
            {arrChildren.splice(0)}
          </_StyledWrapper>
        );
        break;
      }

      element = child;
    } else {
      newChildren.push(child);
      continue;
    }

    newChildren.push(<_StyledChild key={element.key} className={styledClassName} child={element} />);
  }

  return <>{newChildren}</>;
}
_StyledWrapper.displayName = 'StyledWrapper';

import React, { Children, isValidElement, ReactElement, ReactNode } from 'react';
import { _StyledChild } from './_StyledChild';
import { _useStyledClassName } from '../_useStyledClassName';
import { _useTokens } from '../_useTokens';
import { _getCssElementStyleText } from '../_getCssComponentValue';
import { StyledClassName } from '../types/StyledClassName';
import { Token } from '../types/Token';

export interface IStyledWrapperProps {
  _scope?: string;
  _inheritedTokens?: readonly Token[];
  _styleText?: string;
  _className?: StyledClassName;
  _children: ReactNode;
}

export function _StyledWrapper({
  _scope,
  _inheritedTokens,
  _styleText,
  _className,
  _children,
}: IStyledWrapperProps): ReactElement {
  // HACK: While this component is mounted, styleText will either
  // always be nullish or always be non-nullish. That's why this hook
  // can be used conditionally.
  const tokens = _styleText != null ? _useTokens(_styleText, _inheritedTokens) : _inheritedTokens;
  const styledClassName = tokens == null ? _className : _useStyledClassName(tokens, _scope, _className);
  const arrChildren = Children.toArray(_children);
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
          <_StyledWrapper
            key={child.key}
            _scope={_scope}
            _inheritedTokens={tokens}
            _styleText={styleText}
            _className={_className}
            _children={arrChildren.splice(0)}
          />
        );
        break;
      }

      element = child;
    } else {
      newChildren.push(child);
      continue;
    }

    newChildren.push(<_StyledChild key={element.key} _className={styledClassName} _child={element} />);
  }

  return <>{newChildren}</>;
}
_StyledWrapper.displayName = 'StyledWrapper';

import React, { Children, isValidElement, ReactElement, ReactNode, useMemo } from 'react';
import { _StyledChild } from './_StyledChild';
import { _metaKey } from '../_constants';
import { _useTokens } from '../_useTokens';
import { _useStyle } from '../_useStyle';
import { _getInternalComponent } from '../_getInternalComponent';
import { _getCssElementStyleText } from '../_getCssElementStyleText';
import { _getStyledClassName } from '../_getStyledClassName';
import { StyledClassName } from '../types/StyledClassName';
import { Tokens } from '../types/Tokens';

export interface _IStyledWrapperProps {
  _styleText: string;
  _inheritedTokens: Tokens | undefined;
  _scope: string | undefined;
  _className: StyledClassName | undefined;
  _children: ReactNode;
}

export const _StyledWrapper = _getInternalComponent<_IStyledWrapperProps>(
  'w',
  ({ _styleText, _inheritedTokens, _scope, _className, _children }) => {
    const tokens = _useTokens(_styleText, _inheritedTokens);
    const meta = _className?.[_metaKey];
    const style = _useStyle(tokens, meta?.s);
    const styledClassName = useMemo(() => _getStyledClassName(style, meta?.n || _scope, meta ? meta.c : _className), [
      style,
      _scope,
      _className,
    ]);
    const styledChildren = _getStyledWrapperChildren(_scope, _className, _children, tokens, styledClassName);

    return <>{styledChildren}</>;
  }
);

export function _getStyledWrapperChildren(
  scope: string | undefined,
  className: StyledClassName | undefined,
  children: ReactNode,
  tokens?: Tokens,
  styledClassName = className
): (React.ReactChild | React.ReactFragment)[] {
  const arrChildren = Children.toArray(children);
  const styledChildren: (React.ReactChild | React.ReactFragment)[] = [];

  let child: React.ReactChild | React.ReactFragment | undefined;

  while (null != (child = arrChildren.shift())) {
    let element: ReactElement;

    if (typeof child === 'string' || typeof child === 'number') {
      element = <span>{child}</span>;
    } else if (isValidElement(child)) {
      const styleText = _getCssElementStyleText(child);

      if (styleText != null) {
        styledChildren.push(
          <_StyledWrapper
            key={child.key}
            _scope={scope}
            _inheritedTokens={tokens}
            _styleText={styleText}
            _className={className}
            _children={arrChildren.splice(0)}
          />
        );
        break;
      }

      element = child;
    } else {
      styledChildren.push(child);
      continue;
    }

    styledChildren.push(<_StyledChild key={element.key} _className={styledClassName} _child={element} />);
  }

  return styledChildren;
}

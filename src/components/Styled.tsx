import React, { useMemo } from 'react';
import { cx } from '../cx';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _getStyleTokens } from '../private/_getStyleTokens';
import { _getCssText } from '../private/_getCssText';
import { _getStyledClassName, StyledClassName } from '../private/_getStyledClassName';
import { _getConfig } from '../private/_getConfig';
import { _useStyle } from '../private/_useStyle';
import { ICustomStyledProps } from '../types/ICustomStyledProps';

export interface IStyledProps extends ICustomStyledProps {
  /**
   * A style name which will be used to prefix the dynamic class name.
   *
   * @deprecated Use the `scope` prop or a style string `@scope` comment
   * pragma instead.
   */
  name?: string;
  /**
   * A string which helps avoid hash collisions.
   *
   * This string is also used as a prefix for the dynamically generated class
   * name, so it must be safe to use in a class name.
   */
  scope?: string;
  /**
   * Style tagged template value.
   *
   * @deprecated Add the style as a child of the Styled component instead.
   * (e.g. ``<Styled>{css`...`}<div /></Styled>``)
   */
  css?: string;
}

export const Styled: React.VFC<IStyledProps> = ({ name, scope = name, className, css, children }) => {
  let styleText = css ?? '';

  return (
    <>
      {React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          styleText += child;
          return null;
        }

        return React.isValidElement(child) ? (
          <_StyledChild _scope={scope} _className={className} _styleText={styleText} _child={child} />
        ) : (
          child
        );
      })}
    </>
  );
};

const _StyledChild: React.VFC<{
  _scope?: string;
  _className?: string;
  _styleText: string;
  _child: React.ReactElement;
}> = ({ _scope, _className, _styleText, _child: _children }): React.ReactElement => {
  const childClassName = cx(_children?.props.className, _className) as StyledClassName;
  const [key, cssText, styledClassName] = useMemo((): [string, string, string] => {
    const { customHashFunction: getHash } = _getConfig();
    const [newTokens, pragmas] = _getStyleTokens(_styleText);
    const scope = _scope ?? pragmas.scope;
    const parent = childClassName?._styled;
    const tokens = [...newTokens, ...(parent?._tokens ?? [])];
    const hash = getHash(tokens.toString());
    const hashedClassName = (scope ? scope + '--' : '') + 'rcij-' + hash;
    const styledClassName = _getStyledClassName(
      tokens,
      hashedClassName,
      parent ? parent._simpleClassName : childClassName
    );
    const key = scope ? scope + '/' + hash : hash;
    const cssText = _getCssText(tokens, hashedClassName);

    return [key, cssText, styledClassName];
  }, [_scope, _styleText, childClassName]);

  return (
    <>
      {_useStyle(key, cssText) || <style {...{ [_styleAttributeName]: key }}>{cssText}</style>}
      {React.cloneElement(_children, { className: styledClassName })}
    </>
  );
};

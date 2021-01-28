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
   * @deprecated Use a `@scope` comment pragma in the `css` string instead.
   */
  name?: string;
  /**
   * Style tagged template value.
   */
  css?: string;
}

export const Styled: React.VFC<IStyledProps> = ({ name, className, css = '', children }) => {
  children = React.Children.only(children);
  const childClassName = cx(children.props.className, className) as StyledClassName;
  const [key, cssText, styledClassName] = useMemo((): [string, string, string] => {
    const { customHashFunction: getHash } = _getConfig();
    const [newTokens, { scope = name }] = _getStyleTokens(css);
    const parent = childClassName?.styled;
    const tokens = [...newTokens, ...(parent?.tokens ?? [])];
    const hash = getHash(tokens.toString());
    const hashedClassName = (scope ? scope + '--' : '') + 'rcij-' + hash;
    const styledClassName = _getStyledClassName(
      tokens,
      hashedClassName,
      parent ? parent.simpleClassName : childClassName
    );
    const key = scope ? scope + '/' + hash : hash;
    const cssText = _getCssText(tokens, hashedClassName);

    return [key, cssText, styledClassName];
  }, [name, css, childClassName]);

  return (
    <>
      {_useStyle(key, cssText) || <style {...{ [_styleAttributeName]: key }}>{cssText}</style>}
      {React.cloneElement(children, { className: styledClassName })}
    </>
  );
};

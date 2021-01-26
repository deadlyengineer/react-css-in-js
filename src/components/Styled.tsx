import React, { useMemo } from 'react';
import { cx } from '../cx';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _getCssText } from '../private/_getCssText';
import { _getStyledClassName, StyledClassName } from '../private/_getStyledClassName';
import { _useStyle } from '../private/_useStyle';
import { _useHash } from '../private/_useHash';
import { ICustomStyledProps } from '../types/ICustomStyledProps';

export interface IStyledProps extends ICustomStyledProps {
  /**
   * A style name which will be used to prefix the dynamic class name. This is
   * required to help prevent class name collisions which may result from
   * imperfect css string hashing.
   */
  name: string;
  /**
   * Style tagged template value.
   */
  css?: string;
}

export const Styled: React.VFC<IStyledProps> = ({ name, className, css = '', children }) => {
  const childClassName = cx(children.props.className, className) as StyledClassName;
  const parent = childClassName?.styled;
  const styleText = css + (parent?.styleText ?? '');
  const hash = _useHash(styleText);
  const [cssText, styledClassName] = useMemo((): [string, string] => {
    const hashedClassName = `${name}--rcij-${hash}`;
    const styledClassName = _getStyledClassName(
      styleText,
      hashedClassName,
      parent ? parent.simpleClassName : childClassName
    );
    const cssText = _getCssText(styleText, `.${hashedClassName}`);

    return [cssText, styledClassName];
  }, [name, hash, styleText, childClassName]);
  const key = `${name}/${hash}`;

  return (
    <>
      {_useStyle(key, cssText) || <style {...{ [_styleAttributeName]: key }}>{cssText}</style>}
      {React.cloneElement(children, { className: styledClassName })}
    </>
  );
};

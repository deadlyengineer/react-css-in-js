import React, { useMemo } from 'react';
import { cx } from '../cx';
import { _config } from '../private/_config';
import { _getCssText } from '../private/_getCssText';
import { StyledClassName, _getStyledClassName } from '../private/_getStyledClassName';

export interface IStyledProps {
  /**
   * Base class name usually used as a prefix for the final styled component
   * class name with hash suffix.
   */
  name: string;
  /**
   * Style tagged template value.
   */
  css: string;
  children: React.ReactElement;
}

export const Styled: React.VFC<IStyledProps> = ({ name, css, children }) => {
  const childClassName = children.props.className as StyledClassName | undefined;
  const childStyleText = childClassName?.styled?.styleText ?? '';
  const hashedClassName = useMemo(() => _config._current.getClassName(name, css + childStyleText), [
    name,
    css,
    childStyleText,
  ]);
  const styledClassName = (useMemo(() => cx(_getStyledClassName(css, hashedClassName), childClassName), [
    childClassName,
    css,
    hashedClassName,
  ]) as unknown) as Required<StyledClassName>;
  const cssText = useMemo(
    () => _getCssText(styledClassName.styled.styleText, `.${styledClassName.styled.hashedClassName}`),
    [styledClassName]
  );

  return (
    <>
      <style>{cssText}</style>
      {React.cloneElement(children, { className: styledClassName })}
    </>
  );
};

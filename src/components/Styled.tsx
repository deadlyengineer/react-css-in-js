import React, { useMemo } from 'react';
import { Style } from './Style';
import { cx } from '../cx';
import { _config } from '../private/_config';

export interface IStyledProps {
  /**
   * Base class name usually used as a prefix for the final styled component
   * class name with hash suffix.
   */
  className: string;
  /**
   * Style tagged template value.
   */
  css: string;
  children: JSX.Element;
}

export const Styled: React.VFC<IStyledProps> = ({ className, css, children }) => {
  className = useMemo(() => _config._current.getClassName(className, css), [className, css]);

  return (
    <>
      <Style rootSelector={`.${className}`} css={css} />
      {React.cloneElement(children, { className: cx(children.props.className, className) })}
    </>
  );
};

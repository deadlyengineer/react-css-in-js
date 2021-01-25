import React, { useMemo } from 'react';
import { cx } from '../cx';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _useCache } from '../private/_useCache';
import { _getCssText } from '../private/_getCssText';
import { _getStyledClassName, StyledClassName } from '../private/_getStyledClassName';
import { _getConfig } from '../private/_getConfig';

export interface IStyledProps {
  /**
   * A style name which will be used to prefix the dynamic class name. This is
   * required to help prevent class name collisions which may result from
   * imperfect css string hashing.
   */
  name: string;
  /**
   * Additional class(es) to apply to the child element. Class names can also
   * be passed directly to the child element. This is a convenience property
   * so that automatically merges multiple classes using the `cx` utility.
   */
  className?: string | string[];
  /**
   * Style tagged template value.
   */
  css: string;
  children: React.ReactElement;
}

export const Styled: React.VFC<IStyledProps> = ({ name, className = [], css, children }) => {
  const childClassName = cx(...className, children.props.className) as StyledClassName;
  const childStyleText = childClassName?.styled?.styleText ?? '';
  const [hash, cssText, styledClassName] = useMemo((): [string, string, string] => {
    const { getHash } = _getConfig();
    const styleText = css + childStyleText;
    const hash = getHash(styleText);
    const hashedClassName = `${name}--rcij-${hash}`;
    const styledClassName = _getStyledClassName(
      styleText,
      hashedClassName,
      childClassName?.styled?.simpleClassName ?? childClassName
    );
    const cssText = _getCssText(styleText, `.${hashedClassName}`);

    return [hash, cssText, styledClassName];
  }, [name, css, childStyleText, childClassName]);

  return (
    <>
      {_useCache(`${name}:${hash}`, cssText) || (
        <style {...{ [_styleAttributeName]: `${name}:${hash}` }}>{cssText}</style>
      )}
      {React.cloneElement(children, { className: styledClassName })}
    </>
  );
};

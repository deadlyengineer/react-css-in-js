import React, { useMemo, isValidElement, ReactNode, Children, ReactElement } from 'react';
import { _styleAttributeName } from '../private/_constants';
import { _getCssText } from '../private/_getCssText';
import { _useStyle } from '../private/_useStyle';
import { _getStyleTokens } from '../private/_getStyleTokens';
import { _getConfig } from '../private/_getConfig';
import { _Css } from '../private/components/_Css';

export interface IStyleProps {
  /**
   * A string which helps avoid hash collisions.
   */
  scope?: string;
  children?: ReactNode;
}

/**
 * A React component which injects a global stylesheet when rendered.
 * Changes to `css` tagged templates will take effect immediately.
 * The stylesheet is removed when the `Style` component is unmounted.
 *
 * ```tsx
 * <Style>
 *   {css`
 *     html, body {
 *       padding: 0;
 *       margin: 0;
 *     }
 *   `}
 * </Style>
 * ```
 */
export function Style(props: IStyleProps): ReactElement {
  const { scope, children } = props;
  const styleText = Children.toArray(children).reduce<string>((acc, child) => {
    const isCssTaggedTemplate = isValidElement(child) && child.type === _Css;
    return isCssTaggedTemplate ? acc + (child as React.ReactElement).props.value + ';' : acc;
  }, '');
  const [cacheKey, cssText] = useMemo((): [string, string] => {
    const { customHashFunction: getHash } = _getConfig();
    const newTokens = _getStyleTokens(styleText);
    const hash = getHash(newTokens.toString());
    const cacheKey = scope ? scope + '/' + hash : hash;
    const cssText = _getCssText(newTokens);

    return [cacheKey, cssText];
  }, [styleText]);

  return (
    <>
      {_useStyle(cacheKey, cssText) ? null : <style {...{ [_styleAttributeName]: cacheKey }}>{cssText}</style>}
      {children}
    </>
  );
}

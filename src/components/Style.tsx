import React, { useMemo } from 'react';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _getCssText } from '../private/_getCssText';
import { _useStyle } from '../private/_useStyle';
import { _getStyleTokens } from '../private/_getStyleTokens';
import { _getConfig } from '../private/_getConfig';

export interface IStyleProps {
  /**
   * Style tagged template value.
   *
   * @deprecated Add styles as children of the Style component instead.
   * (e.g. ``<Style>{css`...`}</Style>``)
   */
  css?: string;
  /**
   * A string which helps avoid hash collisions.
   */
  scope?: string;
  children?: string | null | undefined | boolean | (string | null | undefined | boolean)[];
}

export const Style: React.VFC<IStyleProps> = ({ css, children }) => {
  const styleText = React.Children.toArray(children).reduce<string>((acc, child) => {
    return typeof child === 'string' ? acc + child : acc;
  }, css ?? '');
  const [key, cssText] = useMemo((): [string, string] => {
    const { customHashFunction: getHash } = _getConfig();
    const [newTokens, { scope }] = _getStyleTokens(styleText);
    const hash = getHash(newTokens.toString());
    const key = scope ? scope + '/' + hash : hash;
    const cssText = _getCssText(newTokens);

    return [key, cssText];
  }, [styleText]);

  return _useStyle(key, cssText) ? null : <style {...{ [_styleAttributeName]: key }}>{cssText}</style>;
};

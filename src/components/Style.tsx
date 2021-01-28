import React, { useMemo } from 'react';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _getCssText } from '../private/_getCssText';
import { _useStyle } from '../private/_useStyle';
import { _getStyleTokens } from '../private/_getStyleTokens';
import { _getConfig } from '../private/_getConfig';

export interface IStyleProps {
  /**
   * Style tagged template value.
   */
  css: string;
}

export const Style: React.VFC<IStyleProps> = ({ css }) => {
  const [key, cssText] = useMemo((): [string, string] => {
    const { customHashFunction: getHash } = _getConfig();
    const [newTokens, { scope }] = _getStyleTokens(css);
    const hash = getHash(newTokens.toString());
    const key = scope ? scope + '/' + hash : hash;
    const cssText = _getCssText(newTokens);

    return [key, cssText];
  }, [css]);

  return _useStyle(key, cssText) ? null : <style {...{ [_styleAttributeName]: key }}>{cssText}</style>;
};

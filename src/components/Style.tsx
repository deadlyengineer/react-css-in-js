import React, { useMemo } from 'react';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _getCssText } from '../private/_getCssText';
import { _useCache } from '../private/_useCache';
import { _getConfig } from '../private/_getConfig';

export interface IStyleProps {
  /**
   * Style tagged template value.
   */
  css: string;
  /**
   * Root selector used for bare CSS properties which are not contained in a
   * CSS selector rule block.
   */
  rootSelector?: string;
}

export const Style: React.VFC<IStyleProps> = ({ css, rootSelector }) => {
  const [hash, cssText] = useMemo((): [string, string] => {
    const { getHash } = _getConfig();
    const hash = getHash(css);
    const cssText = _getCssText(css, rootSelector);

    return [hash, cssText];
  }, [css, rootSelector]);

  return _useCache(hash, cssText) ? null : <style {...{ [_styleAttributeName]: hash }}>{cssText}</style>;
};

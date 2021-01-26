import React, { useMemo } from 'react';
import { _styleAttributeName } from '../private/_styleAttributeName';
import { _getCssText } from '../private/_getCssText';
import { _useStyle } from '../private/_useStyle';
import { _useHash } from '../private/_useHash';

export interface IStyleProps {
  /**
   * Style tagged template value.
   */
  css: string;
}

export const Style: React.VFC<IStyleProps> = ({ css }) => {
  const hash = _useHash(css);
  const cssText = useMemo((): string => _getCssText(css), [hash, css]);

  return _useStyle(hash, cssText) ? null : <style {...{ [_styleAttributeName]: hash }}>{cssText}</style>;
};

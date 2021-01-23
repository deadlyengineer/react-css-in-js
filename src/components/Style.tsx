import React, { useMemo } from 'react';
import { _getCssText } from '../private/_getCssText';

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
  return <style>{useMemo(() => _getCssText(css, rootSelector), [css, rootSelector])}</style>;
};

import React from 'react';
import { Css } from './types/Css';
import { _metaKey } from './private/_constants';
import { _Css } from './private/components/_Css';
import { _getCssStyle } from './private/_getCssStyle';

/**
 * Style string tagged template function.
 *
 * This function returns an invisible component which applies styling
 * when used as the child of a `Styled` or `Style` component.
 *
 * ```tsx
 * <Styled>
 *   {css`
 *     color: blue;
 *   `}
 *   <div>I am blue.</div>
 * </Styled>
 * ```
 */
export function css(template: TemplateStringsArray, ...values: unknown[]): Css {
  return (
    <_Css
      {...{
        [_metaKey]: String.raw(
          template,
          ...values.map((value) => (value == null ? '' : _getCssStyle(value)?._text ?? value))
        ),
      }}
    />
  );
}

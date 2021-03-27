import React, { isValidElement, ReactElement } from 'react';
import { _Css, _ICssProps } from './private/components/_Css';
import { _getCssElementStyleText } from './private/_getCssComponentValue';

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
export function css(template: TemplateStringsArray, ...values: unknown[]): ReactElement<_ICssProps> {
  return (
    <_Css
      reactCssInJsStyleText={String.raw(
        template,
        ...values.map((value) =>
          value == null
            ? ''
            : typeof value === 'object' && isValidElement(value)
            ? _getCssElementStyleText(value) ?? value
            : value
        )
      )}
    />
  );
}

import React, { ReactElement } from 'react';
import { _Css } from './private/components/_Css';

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
export function css(template: TemplateStringsArray, ...values: unknown[]): ReactElement {
  return <_Css value={String.raw(template, ...values)} />;
}

import React, { ReactNode, Children, ReactElement, useRef, isValidElement } from 'react';
import { _StyleChild } from '../private/components/_StyleChild';
import { _getCssElementStyleText } from '../private/_getCssComponentValue';

export interface IStyleProps {
  /**
   * A string which helps avoid hash collisions.
   */
  scope?: string;

  /**
   * Styles (`css` tagged templates).
   */
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
  const hasWarned = useRef(false);

  return (
    <>
      {Children.map(children, (child) => {
        const styleText = isValidElement(child) ? _getCssElementStyleText(child) : undefined;

        if (styleText == null) {
          if (!hasWarned.current) {
            hasWarned.current = true;
            console.warn(Error('Style components should only have css tagged template children.'));
          }

          return null;
        }

        return <_StyleChild scope={scope} styleText={styleText} />;
      })}
    </>
  );
}

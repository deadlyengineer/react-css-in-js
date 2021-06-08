import React, { ReactNode, Children, useRef } from 'react';
import { _StyleChild } from '../private/components/_StyleChild';
import { _getCssStyle } from '../private/_getCssStyle';
import { _getInternalComponent } from '../private/_getInternalComponent';

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
export const Style = _getInternalComponent<IStyleProps>('style', (props) => {
  const { scope, children } = props;
  const hasWarned = useRef(false);

  return (
    <>
      {Children.map(children, (child) => {
        const style = _getCssStyle(child);

        if (style == null) {
          if (!hasWarned.current) {
            hasWarned.current = true;
            console.warn(Error('Style components should only have css tagged template children.'));
          }

          return null;
        }

        return <_StyleChild _scope={scope} _styleText={style._text} />;
      })}
    </>
  );
});

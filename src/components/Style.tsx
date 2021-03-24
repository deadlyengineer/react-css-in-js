import React, { isValidElement, ReactNode, Children, ReactElement, useRef } from 'react';
import { _Css } from '../private/components/_Css';
import { _Style } from '../private/components/_Style';

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
export function Style(props: IStyleProps): ReactElement | null {
  const { scope, children } = props;
  const hasWarned = useRef(false);

  return (
    <>
      {Children.map(children, (child) => {
        if (!isValidElement(child) || child.type !== _Css) {
          if (!hasWarned.current) {
            hasWarned.current = true;
            console.warn(Error('Style components should only have css tagged template children.'));
          }

          return null;
        }

        return !!child.props.value && <_Style scope={scope} styleText={child.props.value} />;
      })}
    </>
  );
}

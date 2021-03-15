import React, { isValidElement, ReactNode, Children, ReactElement } from 'react';
import { _Css } from '../private/components/_Css';
import { _StyledWrapper } from '../private/components/_StyledWrapper';

export interface IStyledProps {
  /**
   * A string which helps avoid hash collisions.
   *
   * This string is also used as a prefix for the dynamically
   * generated class name, so it must be safe to use in a class name.
   */
  scope?: string;
  /**
   * Class name (or an array of class names) that will be passed on
   * to all child components.
   */
  className?: string;
  /**
   * Styles and components that styles will be applied to.
   */
  children?: ReactNode;
}

/**
 * A React component which applies styles to child components. Each
 * child component will be styled by _all_ of the combined `css`
 * tagged templates which precede it. Changes to `css` tagged
 * templates will take effect immediately. All associated stylesheets
 * will be removed when the `Styled` component is unmounted.
 *
 * ```tsx
 * <Styled>
 *   {css`
 *     color: red;
 *   `}
 *   <div>I am red.</div>
 * </Styled>
 * ```
 */
export function Styled(props: IStyledProps): ReactElement {
  const { scope, className, children } = props;

  let styleText = '';

  return (
    <>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          if (child.type !== _Css) {
            return <_StyledWrapper scope={scope} className={className} styleText={styleText} child={child} />;
          }

          styleText += child.props.value + ';';
        }

        return child;
      })}
    </>
  );
}

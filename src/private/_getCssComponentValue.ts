import { ReactElement } from 'react';

export function _getCssElementStyleText(element: ReactElement): string | undefined {
  return typeof element.props.reactCssInJsStyleText === 'string' ? element.props.reactCssInJsStyleText : undefined;
}

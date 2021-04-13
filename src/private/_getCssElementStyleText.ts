import { ReactElement } from 'react';
import { _metaKey } from './_constants';

export function _getCssElementStyleText(element: ReactElement): string | undefined {
  return typeof element.props[_metaKey] === 'string' ? element.props[_metaKey] : undefined;
}

import { _metaKey } from '../_constants';
import { _getInternalComponent } from '../_getInternalComponent';

export interface _ICssProps {
  readonly [_metaKey]: string;
}

export const _Css = _getInternalComponent<_ICssProps>('t');

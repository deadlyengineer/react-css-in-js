import { _metaKey } from '../_constants';
import { IStyle } from './IStyle';

/**
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export type StyledClassName = string & {
  readonly [_metaKey]?: {
    readonly s: IStyle;
    readonly n: string | undefined;
    readonly c: string | undefined;
    readonly t: string;
  };
};

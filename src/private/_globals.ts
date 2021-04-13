import { IStyleConfig } from '../types/IStyleConfig';
import { _metaKey } from './_constants';

export interface IGlobals {
  s: Map<string, number>;
  c: IStyleConfig;
}

declare global {
  interface Window {
    /**
     * _MUST REMAIN STABLE BETWEEN VERSIONS!_
     */
    [_metaKey]?: {
      s: Map<string, number>;
      c: IStyleConfig;
    };
  }
}

export const _globals: IGlobals = (window[_metaKey] = window[_metaKey] ?? {
  s: new Map(),
  c: {},
});

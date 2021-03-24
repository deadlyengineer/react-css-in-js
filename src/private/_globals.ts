import { _isBrowser } from './_constants';
import { _getHashDefault } from './_getHashDefault';
import { IStyleConfig } from '../types/IStyleConfig';
import { _styleManagerDefault } from './_styleManagerDefault';

const keyStyleRefs = '__RCIJ_STYLE_REFS__';
const keyConfig = '__RCIJ_CONFIG__';

declare global {
  interface Window {
    [keyStyleRefs]?: Map<string, number>;
    [keyConfig]?: IStyleConfig;
  }
}

/**
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export const _styleRefCounts = (window[keyStyleRefs] = window[keyStyleRefs] ?? new Map());

/**
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export const _config: IStyleConfig = (window[keyConfig] = window[keyConfig] ?? {
  pretty: _isBrowser,
  customStyleManager: _isBrowser ? _styleManagerDefault : null,
  customHashFunction: _getHashDefault,
});
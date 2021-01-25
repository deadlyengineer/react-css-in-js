import { _config } from './_config';
import { IStyleConfig } from '../IStyleConfig';

export function _getConfig(): IStyleConfig {
  _config._locked = true;
  return _config._current;
}

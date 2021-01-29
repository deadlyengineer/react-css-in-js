import { _isBrowser } from './_constants';
import { _getHash } from './_getHash';
import { IStyleConfig } from '../types/IStyleConfig';

export const _config: IStyleConfig = {
  pretty: _isBrowser,
  customStyleManager: null,
  customHashFunction: _getHash,
};

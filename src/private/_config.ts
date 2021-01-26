import { _getHash } from './_getHash';
import { IStyleConfig } from '../types/IStyleConfig';

export const _config: IStyleConfig = {
  pretty: false,
  customStyleManager: null,
  customHashFunction: _getHash,
};

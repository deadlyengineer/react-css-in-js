import { _getHash } from './_getHash';
import { IStyleConfig } from '../types/IStyleConfig';

export const _config: IStyleConfig = {
  pretty: false,
  styleManager: null,
  getHash: _getHash,
};

import { _getHash } from './_getHash';
import { IStyleConfig } from '../IStyleConfig';

export const _config: { _current: IStyleConfig } = {
  _current: { pretty: false, styleManager: 'default', getHash: _getHash },
};

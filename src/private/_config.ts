import { _getHash } from './_getHash';
import { IStyleConfig } from '../IStyleConfig';

export const _config: { _locked: boolean; _current: IStyleConfig } = {
  _locked: false,
  _current: {
    pretty: false,
    styleManager: 'default',
    isBrowser: typeof document !== 'undefined',
    getHash: _getHash,
  },
};

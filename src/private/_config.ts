import { IConfig } from '../IConfig';
import { _getClassName } from './_getClassName';

export const _config: { _current: IConfig } = {
  _current: { pretty: false, getClassName: _getClassName },
};

import { _globals } from './private/_globals';
import { _getConfig } from './private/_getConfig';
import { IStyleConfig } from './types/IStyleConfig';

/**
 * Set configuration options for react-css-in-js.
 */
export function configure(options: IStyleConfig = {}): void {
  if (_getConfig._locked) {
    console.warn('react-css-in-js: The configure() method must be called before rendering.');
  } else {
    Object.assign(_globals.c, options);
  }
}

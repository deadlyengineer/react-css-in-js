import { _config } from './private/_config';
import { _getConfig } from './private/_getConfig';
import { IStyleConfig } from './types/IStyleConfig';

/**
 * Set configuration options for react-css-in-js. Returns the _previous_
 * configuration.
 */
export function configure(options: Partial<IStyleConfig> = {}): void {
  if (_getConfig._locked) {
    console.warn('react-css-in-js: The configure() method must be called before rendering.');
    return;
  }

  Object.keys(options).forEach((key) => {
    const value = options[key as keyof IStyleConfig] as never;

    if (value !== undefined) {
      _config[key as keyof IStyleConfig] = value;
    }
  });
}

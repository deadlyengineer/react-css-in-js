import { _config } from './private/_config';
import { IStyleConfig } from './IStyleConfig';

/**
 * Set configuration options for react-css-in-js. Returns the _previous_
 * configuration.
 */
export function configure(options: Partial<IStyleConfig> = {}): void {
  if (_config._locked) {
    console.warn('The configure() method should be called before using react-css-in-js.');
  }

  Object.keys(options).forEach((key) => {
    const value = options[key as keyof IStyleConfig] as never;

    if (value != null) {
      _config._current[key as keyof IStyleConfig] = value;
    }
  });
}

import { IStyleConfig } from './IStyleConfig';
import { _config } from './private/_config';

/**
 * Set configuration options for react-css-in-js. Returns the _previous_
 * configuration.
 */
export function configure(options: Partial<IStyleConfig> = {}): IStyleConfig {
  if (_config._locked) {
    console.warn('Configure should be called before using react-css-in-js.');
  }

  const prev = { ..._config._current };

  Object.keys(options).forEach((key) => {
    const value = options[key as keyof IStyleConfig] as never;

    if (value != null) {
      _config._current[key as keyof IStyleConfig] = value;
    }
  });

  return prev;
}

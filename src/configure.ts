import { _config } from './private/_config';
import { IStyleConfig } from './IStyleConfig';

/**
 * Set configuration options for react-css-in-js. Returns the _previous_
 * configuration.
 */
export function configure(options: Partial<IStyleConfig> = {}): IStyleConfig {
  const prev = { ..._config._current };

  Object.keys(options).forEach((key) => {
    const value = options[key as keyof IStyleConfig] as never;

    if (value != null) {
      _config._current[key as keyof IStyleConfig] = value;
    }
  });

  return prev;
}

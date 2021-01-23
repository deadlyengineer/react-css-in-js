import { IConfig } from './IConfig';
import { _config } from './private/_config';

/**
 * Set configuration options for react-css-in-js.
 */
export function configure(options: Partial<IConfig> = {}): void {
  Object.keys(options).forEach((key) => {
    const value = options[key as keyof IConfig] as never;

    if (value != null) {
      _config._current[key as keyof IConfig] = value;
    }
  });
}

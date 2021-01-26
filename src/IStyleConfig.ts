import { IStyleManager } from './IStyleManager';

export interface IStyleConfig {
  /**
   * Pretty format CSS strings when set to true.
   */
  pretty: boolean;
  /**
   * The style manager which will render each style element. A value of
   * `"default"` (the default) uses a default style manager in the browser,
   * and no style manager on the server, which will allow server-side rendering
   * to work without any configuration. A value of `"none"` will force styles
   * to be rendered inline.
   */
  styleManager: IStyleManager | 'default' | 'none';
  /**
   * Get a hash for the given string (must be CSS class name safe).
   */
  getHash: (value: string) => string;
}

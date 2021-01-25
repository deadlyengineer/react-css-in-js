import { IStyleManager } from './IStyleManager';

export interface IStyleConfig {
  /**
   * Pretty format CSS strings when set to true.
   */
  pretty: boolean;
  /**
   * Set the style manager which will cache and render each style element.
   * Setting this to `"none"` will force styles to be rendered inline.
   */
  styleManager: IStyleManager | 'default' | 'none';
  /**
   * Get a hash for the given string (must be CSS class name safe).
   */
  getHash: (value: string) => string;
}

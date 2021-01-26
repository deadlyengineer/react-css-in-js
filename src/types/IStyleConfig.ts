import { IStyleManager } from './IStyleManager';

export interface IStyleConfig {
  /**
   * Pretty format CSS strings when set to true.
   */
  pretty: boolean;
  /**
   * The style manager which adds style elements when styles are registered,
   * and removes them when they are unregistered.
   */
  styleManager: IStyleManager | null;
  /**
   * Get a hash for the given string (must be CSS class name safe).
   */
  getHash: (value: string) => string;
}

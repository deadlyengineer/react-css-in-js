import { IStyleManager } from './IStyleManager';

export interface IStyleConfig {
  /**
   * Pretty format CSS strings when set to true.
   */
  pretty: boolean;
  /**
   * The style manager adds style elements when styles are registered, and
   * removes them when they are unregistered.
   */
  customStyleManager: IStyleManager | null;
  /**
   * The hash function is used to generate the suffix for dynamic class names,
   * and to generate the style keys passed to style managers.
   */
  customHashFunction: (value: string) => string;
}

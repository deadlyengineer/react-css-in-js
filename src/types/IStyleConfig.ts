import { IStyleManager } from './IStyleManager';

/**
 * Configuration options for `react-css-in-js`.
 */
export interface IStyleConfig {
  /**
   * Pretty format `<style>` element CSS text when set to true.
   */
  pretty: boolean;

  /**
   * The style manager adds style elements when styles are
   * registered, and removes them when they are unregistered.
   *
   * Using a custom style manager allows control over how style
   * elements are injected into the DOM.
   */
  customStyleManager: IStyleManager | null;

  /**
   * The hash function is used to generate the suffix for dynamic
   * class names, and to generate the style cache keys passed to
   * style managers.
   */
  customHashFunction: (value: string) => string;
}

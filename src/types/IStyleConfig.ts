import { ICssPrinter } from './ICssPrinter';
import { IStyleManager } from './IStyleManager';
import { StyleTokens } from './StyleTokens';

/**
 * Configuration options for `react-css-in-js`.
 *
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export interface IStyleConfig {
  /**
   * The CSS text printer controls how CSS is formatted.
   *
   * Using a custom CSS printer allows control over how CSS rules
   * are formatted.
   */
  customCssPrinter?: ICssPrinter;

  /**
   * The style manager adds style elements when styles are
   * registered, and removes them when they are unregistered.
   *
   * Using a custom style manager allows control over how style
   * elements are injected into the DOM.
   */
  customStyleManager?: IStyleManager;

  /**
   * The hash function is used to generate the suffix for dynamic
   * class names, and to generate the style cache keys passed to
   * style managers.
   */
  customHashFunction?: (tokens: StyleTokens) => string;
}

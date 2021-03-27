/**
 * A CSS printer controls how CSS is formatted for style element
 * text content.
 *
 * Using a custom CSS printer may be useful useful for minifying or
 * auto-prefixing.
 *
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export interface ICssPrinter {
  /**
   * Return the values as a CSV string.
   *
   * If a property is given, then the values are for that property.
   * _The property should never be included in the returned string!_
   */
  csv(values: string[], property?: string): string;
  /**
   * Return an indented CSS property string.
   */
  property(indent: string, key: string, value?: string): string;
  /**
   * Return an indented block opening with the given selectors.
   */
  openBlock(indent: string, selectors: string[]): string;
  /**
   * Return an indented block closing.
   */
  closeBlock(indent?: string): string;
}

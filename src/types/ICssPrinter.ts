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
   * Return an indented CSS property string. The key will be null
   * for at-rules (`@`).
   */
  property(indent: string, key: string | null, values: string[]): string;
  /**
   * Return an indented block opening with the given conditions.
   */
  openBlock(indent: string, conditions: string[]): string;
  /**
   * Return an indented block closing.
   */
  closeBlock(indent?: string): string;
}

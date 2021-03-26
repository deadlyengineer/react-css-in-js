import { IStyleDehydrated } from './IStyleDehydrated';

/**
 * A style manager adds style elements when styles are registered,
 * and removes them when they are unregistered.
 *
 * Using a custom style manager allows control over how style
 * elements are injected into the DOM.
 *
 * _MUST REMAIN STABLE BETWEEN VERSIONS!_
 */
export interface IStyleManager {
  /**
   * Called when a new style element should be added to the DOM.
   *
   * The `replacedCacheKey` is the key of the style that the new
   * style is derived from, which should be used to insert the new
   * style in proximity to the previous style, so that precedence is
   * not drastically affected when a style is mutated.
   */
  register(cacheKey: string, cssText: string, replacedCacheKey: string | undefined): void;

  /**
   * Called when an existing style element should be removed from
   * the DOM.
   */
  unregister(cacheKey: string): void;

  /**
   * Called before React container hydration when using SSR (server
   * side rendering). All of the styles which are passed in should
   * be moved out of the container so that the React hydration
   * process doesn't find a DOM mismatch.
   */
  hydrate(styles: IStyleDehydrated[]): void;
}

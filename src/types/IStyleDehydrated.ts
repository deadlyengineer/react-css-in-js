/**
 * An HTML style element that was rendered inline using SSR (server
 * side rendering), and the cache key used to uniquely identify the
 * style.
 *
 * An array of these objects is passed to the style manager `hydrate`
 * method so that SSR styles can be moved to the DOM head before
 * React container rehydration.
 */
export interface IStyleDehydrated {
  readonly cacheKey: string;
  readonly element: HTMLStyleElement;
}

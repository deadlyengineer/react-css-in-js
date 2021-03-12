/**
 * Generate a heading selectors string (eg. `h1, h2, h3`) from the low number
 * to the high number.
 *
 * ```ts
 * const selector = h(2, 4); // "h2, h3, h4"
 * ```
 */
export function h(low: number, high: number): string {
  if (low > high) {
    [low, high] = [high, low];
  }

  let selector = `h${low}`;

  for (let i = low + 1; i <= high; ++i) {
    selector += `, h${i}`;
  }

  return selector;
}

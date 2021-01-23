/**
 * Class name merge function which omits "falsy" class names.
 */
export function cx(...classNames: unknown[]): string {
  return classNames
    .filter((className) => className)
    .map((className) => `${className}`.trim())
    .join(' ');
}

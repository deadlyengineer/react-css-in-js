/**
 * Default hash function.
 *
 * Derived from https://github.com/darkskyapp/string-hash.
 */
export function defaultHashFunction(tokens: readonly string[]): string {
  let hash = 5381;

  for (let i = tokens.length - 1; i >= 0; --i) {
    for (let str = tokens[i], j = str.length - 1; j >= 0; --j) {
      hash = (hash * 33) ^ str.charCodeAt(j);
    }
  }

  return (hash >>> 0).toString(36);
}

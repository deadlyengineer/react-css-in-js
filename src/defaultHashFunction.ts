import { StyleTokens } from './types/StyleTokens';

/**
 * Default hash function.
 *
 * Derived from https://github.com/darkskyapp/string-hash.
 */
export function defaultHashFunction(str: StyleTokens): string {
  return (hash(str) >>> 0).toString(36);
}

function hash(tokens: StyleTokens, value = 5381): number {
  let i = tokens.length;

  if (typeof tokens === 'string') {
    while (i) {
      value = (value * 33) ^ tokens.charCodeAt(--i);
    }
  } else {
    while (i) {
      value = hash(tokens[--i], value);
    }
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bit shift. */
  return value;
}

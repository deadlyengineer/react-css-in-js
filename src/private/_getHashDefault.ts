// https://github.com/darkskyapp/string-hash

import { StyleTokens } from '../types/StyleTokens';

export function _getHashDefault(str: StyleTokens): string {
  return (_next(str) >>> 0).toString(36);
}

function _next(tokens: StyleTokens, hash = 5381): number {
  let i = tokens.length;

  if (typeof tokens === 'string') {
    while (i) {
      hash = (hash * 33) ^ tokens.charCodeAt(--i);
    }
  } else {
    while (i) {
      hash = _next(tokens[--i], hash);
    }
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bit shift. */
  return hash;
}

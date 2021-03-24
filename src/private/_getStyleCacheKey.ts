export function _getStyleCacheKey(scope: string | undefined, hash: string): string {
  return scope ? `${scope}/${hash}` : hash;
}

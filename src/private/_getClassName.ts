import { _getHash } from './_getHash';

export function _getClassName(name: string, style: string): string {
  return `${name}--rcijs-${_getHash(style).toString(36)}`;
}

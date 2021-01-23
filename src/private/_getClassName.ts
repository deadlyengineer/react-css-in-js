import { _getHash } from './_getHash';

export function _getClassName(className: string, style: string): string {
  return `${className}--rcijs-${_getHash(style).toString(36)}`;
}

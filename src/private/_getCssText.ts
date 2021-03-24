import { _getCssBuilder } from './_getCssBuilder';
import { _getTokenValues } from './_getTokenValues';
import { _getTokenProperty } from './_getTokenProperty';
import { Token } from './types/Token';
import { TokenTerminator } from './types/TokenTerminator';

export function _getCssText(tokens: readonly Token[], className?: string): string {
  const builder = _getCssBuilder(className);
  const tokensCopy = [...tokens];
  let token: Token | undefined;

  while (null != (token = tokensCopy.shift())) {
    if (token instanceof Array) {
      const isAtRule = token[0] === '@';
      const terminator = tokensCopy.shift() as TokenTerminator;

      if (terminator === ';') {
        // Property closing
        if (isAtRule) {
          builder._property(_getTokenValues(token));
        } else {
          const property = _getTokenProperty(token);

          if (property) {
            builder._property(property[0], property[1]);
          }
        }
      } else {
        // Block opening
        builder._openBlock(_getTokenValues(token));
      }
    } else {
      builder._closeBlock();
    }
  }

  return builder._build();
}

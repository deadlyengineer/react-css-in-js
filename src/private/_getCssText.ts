import { _getCssBuilder } from './_getCssBuilder';
import { Token } from './types/Token';
import { TokenTerminator } from './types/TokenTerminator';

export function _getCssText(tokens: readonly Token[], className?: string): string {
  const builder = _getCssBuilder(className);
  const tokensCopy = [...tokens];
  let token: Token | undefined;

  while (null != (token = tokensCopy.shift())) {
    if (token instanceof Array) {
      const terminator = tokensCopy.shift() as TokenTerminator;

      if (terminator === ';') {
        // Property closing
        builder._property(token);
      } else {
        // Block opening
        builder._openBlock(token);
      }
    } else {
      builder._closeBlock();
    }
  }

  return builder._build();
}

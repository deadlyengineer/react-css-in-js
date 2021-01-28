import { _getCssBuilder } from './_getCssBuilder';
import { _getStyleTokenValues } from './_getStyleTokenValues';
import { _getStyleTokenProperty } from './_getStyleTokenProperty';
import { TerminatorToken, Token, Tokens } from './types/Tokens';

export function _getCssText(styleTokens: Tokens, className?: string): string {
  const builder = _getCssBuilder(className);
  const tokens = [...styleTokens];
  let token: Token | undefined;

  while (null != (token = tokens.shift())) {
    if (token instanceof Array) {
      const isAtRule = token[0] === '@';
      const terminator = tokens.shift() as TerminatorToken;

      if (terminator === ';') {
        // Property closing
        if (isAtRule) {
          builder._property(_getStyleTokenValues(token));
        } else {
          const property = _getStyleTokenProperty(token);

          if (property) {
            builder._property(property[0], property[1]);
          }
        }
      } else {
        // Block opening
        builder._openBlock(_getStyleTokenValues(token));
      }
    } else {
      builder._closeBlock();
    }
  }

  return builder._build();
}

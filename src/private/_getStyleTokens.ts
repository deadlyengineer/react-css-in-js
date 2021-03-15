/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tokens, Token } from './types/Tokens';
import { _getConfig } from './_getConfig';

/**
 * Tokenize the style string.
 *
 * The following tokens will be omitted.
 * - extra spaces
 * - empty blocks
 *
 * The following tokens will be added.
 * - missing semicolons
 * - missing closing curly braces
 * - missing block selectors (&)
 */
export function _getStyleTokens(style: string): Tokens {
  const re = /\\[\s\S]|[@:]|(?:\s*([,;{}])\s*)|(['"])(?:[\s\S]*?\2|[\s\S]*$)|((\s+)?\/\*(?:[\s\S]*?\*\/(\s+)?|[\s\S]*$))|(\s+)/g;

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let separator = '';
  let depth = 0;
  let chunks: string[] = [];
  const tokens: Token[] = [];

  function chunk(value: string) {
    if (separator) {
      chunks.push(separator, value);
      separator = '';
    } else {
      chunks.push(value);
    }
  }

  function expression(isSelector: boolean) {
    separator = '';

    if (!isSelector) {
      if (!chunks.length) {
        // Empty property.
        return;
      }

      const iColon = chunks.indexOf(':');

      if (iColon >= 0 && chunks[iColon + 1] === ' ') {
        chunks.splice(iColon + 1, 1);
      }
    }

    tokens.push(chunks.length ? chunks : ['&']);
    chunks = [];

    if (!isSelector) {
      tokens.push(';');
    }
  }

  function space() {
    if (chunks.length && !separator) {
      separator = ' ';
    }
  }

  function openBlock() {
    // Record the block start index (including selector).
    depth++;
    tokens.push('{');
  }

  function closeBlock() {
    depth--;

    if (tokens[tokens.length - 1] === '{') {
      // Discard the empty block.
      tokens.splice(-2);
    } else {
      tokens.push('}');
    }
  }

  while (null != (match = re.exec(style))) {
    if (match.index > lastIndex) {
      chunk(style.substring(lastIndex, match.index));
    }

    lastIndex = re.lastIndex;

    const [token, terminator, _quote, comment, commentLeader, commentTrailer, blank] = match;

    if (comment) {
      if (commentLeader || commentTrailer) {
        space();
      }
    } else if (blank) {
      space();
    } else if (terminator === ',') {
      if (chunks.length) {
        separator = terminator;
      }
    } else if (terminator === '{') {
      expression(true /* selector */);
      openBlock();
    } else if (terminator) {
      expression(false /* property */);

      if (terminator === '}') {
        closeBlock();
      }
    } else {
      chunk(token);
    }
  }

  if (lastIndex < style.length) {
    chunk(style.substring(lastIndex));
  }

  expression(false /* property */);

  for (; depth > 0; depth--) {
    closeBlock();
  }

  return tokens;
}

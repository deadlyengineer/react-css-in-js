import { Token } from './types/Token';

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
 *
 * It should be safe to concatenate token arrays.
 */
export function _getTokens(styleText: string): Token[] {
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

  function selector() {
    separator = '';
    tokens.push(chunks.length ? chunks : ['&']);
    chunks = [];
  }

  function property() {
    separator = '';

    if (!chunks.length) {
      // Empty.
      return;
    }

    const i = chunks.indexOf(':') + 1;

    if (i >= 1 && chunks[i] === ' ') {
      // Remove space after key:value separator.
      chunks.splice(i, 1);
    }

    tokens.push(chunks.length ? chunks : ['&'], ';');
    chunks = [];
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

  while (null != (match = re.exec(styleText))) {
    if (match.index > lastIndex) {
      chunk(styleText.substring(lastIndex, match.index));
    }

    lastIndex = re.lastIndex;

    const [token, terminator, , comment, commentLeader, commentTrailer, blank] = match;

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
      selector();
      openBlock();
    } else if (terminator) {
      property();

      if (terminator === '}') {
        closeBlock();
      }
    } else {
      chunk(token);
    }
  }

  if (lastIndex < styleText.length) {
    chunk(styleText.substring(lastIndex));
  }

  property();

  for (; depth > 0; depth--) {
    closeBlock();
  }

  return tokens;
}

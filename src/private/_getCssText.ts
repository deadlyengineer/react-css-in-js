import { _getCssBuilder } from './_getCssBuilder';

export function _getCssText(style: string, rootSelector?: string): string {
  const builder = _getCssBuilder(rootSelector);
  const re = /(\s+)|\\.|(\/\*(?:(?:[\s\S]*?)\*\/|[\s\S]*$))|(["'])(?:(?:\\[\s\S]|[\s\S])*?\3|.*$)|[,;{}]/g;

  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while (null != (match = re.exec(style))) {
    if (match.index > lastIndex) {
      builder._word(style.substring(lastIndex, match.index));
    }

    lastIndex = re.lastIndex;

    const [token, space, comment] = match;

    if (space) {
      builder._space();
    } else if (!comment) {
      switch (token) {
        case '{':
          builder._openBlock();
          break;
        case '}':
          builder._closeBlock();
          break;
        case ';':
          builder._property();
          break;
        case ',':
          builder._value();
          break;
        default:
          builder._word(token);
      }
    }
  }

  if (lastIndex < style.length) {
    builder._word(style.substring(lastIndex));
  }

  return builder._build();
}

import { _getStyle } from './_getStyle';
import { _getStyledClassName } from './_getStyledClassName';
import { StyledClassName } from './types/StyledClassName';
import { Token } from './types/Token';
import { IStyle } from './types/IStyle';

/**
 * Join class names together in a space separated string. Falsy
 * class names will be omitted.
 *
 * If one or more class names have styled metadata, then the returned
 * class will have merged styled metadata. Metadata is merged first
 * (lowest precedence) to last (highest precedence).
 */
export function _getJoinedClassName(...classNames: (StyledClassName | undefined)[]): StyledClassName | undefined {
  const truthyClassNames = classNames.filter((className): className is StyledClassName => !!className);

  if (truthyClassNames.length === 0) {
    return undefined;
  }

  if (truthyClassNames.length === 1) {
    return truthyClassNames[0];
  }

  const otherClassNames: string[] = [];

  let tokens: undefined | IStyle | readonly Token[];
  let scope: string | undefined;

  for (const className of truthyClassNames) {
    if (className?._styled) {
      tokens = tokens ? [...tokens, ...className._styled._style] : className._styled._style;
      scope = scope || className._styled._scope;

      if (className._styled._otherClassName) {
        otherClassNames.push(className._styled._otherClassName);
      }
    } else {
      otherClassNames.unshift(className);
    }
  }

  if (!tokens) {
    return otherClassNames.join(' ') || undefined;
  }

  return _getStyledClassName('_hash' in tokens ? tokens : _getStyle(tokens), scope, otherClassNames.join(' '));
}

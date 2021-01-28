import { Token } from './private/types/Tokens';
import { _getStyledClassName, StyledClassName } from './private/_getStyledClassName';

/**
 * Class name merge function which omits "falsy" class names and keeps styles
 * inherited from parent `<Styled>` wrappers.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cx(...classNames: any[]): string;
export function cx(...classNames: (StyledClassName | 0 | false | null | undefined)[]): StyledClassName {
  const simpleClassNames: string[] = [];
  const tokens: Token[] = [];
  let hashedClassName: string | undefined;

  classNames.forEach((className) => {
    if (!className) return;

    const { _styled } = className;

    if (_styled) {
      if (_styled._simpleClassName) {
        simpleClassNames.push(_styled._simpleClassName);
      }

      if (!hashedClassName) {
        hashedClassName = _styled._hashedClassName;
      }

      tokens.push(..._styled._tokens);
    } else {
      simpleClassNames.push(className);
    }
  });

  const simpleClassName = simpleClassNames.join(' ');

  return hashedClassName ? _getStyledClassName(tokens, hashedClassName, simpleClassName) : simpleClassName;
}

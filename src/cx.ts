import { _getStyledClassName, StyledClassName } from './private/_getStyledClassName';

/**
 * Class name merge function which omits "falsy" class names and keeps styles
 * inherited from parent `<Styled>` wrappers.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cx(...classNames: any[]): string;
export function cx(...classNames: (StyledClassName | undefined)[]): string {
  const simpleClassNames: string[] = [];
  let hashedClassName: string | undefined;
  let styleText = '';

  classNames.forEach((className) => {
    if (!className) return;

    const { styled } = className;

    if (styled) {
      if (styled.simpleClassName) {
        simpleClassNames.push(styled.simpleClassName);
      }

      if (!hashedClassName) {
        hashedClassName = styled.hashedClassName;
      }

      styleText += styled.styleText;
    } else {
      simpleClassNames.push(className);
    }
  });

  const simpleClassName = simpleClassNames.join(' ');

  return hashedClassName ? _getStyledClassName(styleText, hashedClassName, simpleClassName) : simpleClassName;
}

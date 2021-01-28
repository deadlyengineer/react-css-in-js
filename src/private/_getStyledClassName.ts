import { Token } from './types/Tokens';

export type StyledClassName = string & {
  readonly styled?: {
    readonly tokens: Token[];
    readonly hashedClassName: string;
    readonly simpleClassName: string | undefined;
  };
};

export function _getStyledClassName(
  tokens: Token[],
  hashedClassName: string,
  simpleClassName?: string
): StyledClassName {
  const className = simpleClassName ? simpleClassName + ' ' + hashedClassName : hashedClassName;

  return Object.assign(className, {
    styled: { tokens, hashedClassName, simpleClassName },
    toString: () => className,
    valueOf: () => className,
  });
}

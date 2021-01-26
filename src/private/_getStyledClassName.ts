export type StyledClassName = string & {
  styled?: {
    readonly styleText: string;
    readonly hashedClassName: string;
    readonly simpleClassName: string | undefined;
  };
};

export function _getStyledClassName(
  styleText: string,
  hashedClassName: string,
  simpleClassName?: string
): StyledClassName {
  const className = simpleClassName ? `${simpleClassName} ${hashedClassName}` : hashedClassName;

  return Object.assign(className, {
    styled: { styleText, hashedClassName, simpleClassName },
    toString: () => className,
    valueOf: () => className,
  });
}

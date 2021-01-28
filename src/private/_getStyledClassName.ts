import { Token } from './types/Tokens';

export type StyledClassName = string & {
  readonly _styled?: {
    readonly _tokens: Token[];
    readonly _hashedClassName: string;
    readonly _simpleClassName: string | undefined;
  };
};

export function _getStyledClassName(
  _tokens: Token[],
  _hashedClassName: string,
  _simpleClassName?: string
): StyledClassName {
  const className = _simpleClassName ? _simpleClassName + ' ' + _hashedClassName : _hashedClassName;

  return Object.assign(className, {
    _styled: { _tokens, _hashedClassName, _simpleClassName },
    toString: () => className,
    valueOf: () => className,
  });
}

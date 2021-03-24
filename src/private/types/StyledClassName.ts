import { IStyle } from './IStyle';

export type StyledClassName = string & {
  readonly _styled?: {
    readonly _style: IStyle;
    readonly _scope: string | undefined;
    readonly _className: string;
    readonly _otherClassName: string | undefined;
    readonly _cssText: string;
  };
};

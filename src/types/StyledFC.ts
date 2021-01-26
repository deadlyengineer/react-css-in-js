import { ICustomStyledProps } from './ICustomStyledProps';

// eslint-disable-next-line @typescript-eslint/ban-types
export type StyledFC<P extends {} = {}> = React.VFC<P & ICustomStyledProps>;

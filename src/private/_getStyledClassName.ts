import { _metaKey } from './_constants';
import { _getCssText } from './_getCssText';
import { StyledClassName } from './types/StyledClassName';
import { IStyle } from './types/IStyle';

export function _getStyledClassName(
  style: IStyle,
  scope: string | undefined,
  otherClassName: string | undefined
): string & Required<StyledClassName> {
  const className = `${scope ? `${scope}--` : ''}rcij-${style.h}`;

  let cssText: string | undefined;

  return Object.assign(otherClassName ? otherClassName + ' ' + className : className, {
    [_metaKey]: {
      s: style,
      n: scope,
      c: otherClassName,
      get t(): string {
        return cssText ?? (cssText = _getCssText(style, className));
      },
    },
  });
}

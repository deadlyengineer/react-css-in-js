import { StyledClassName } from './types/StyledClassName';
import { IStyle } from './types/IStyle';
import { _getCssText } from './_getCssText';

export function _getStyledClassName(
  style: IStyle,
  scope: string | undefined,
  otherClassName: string | undefined
): string & Required<StyledClassName> {
  const className = `${scope ? `${scope}--` : ''}rcij-${style._hash}`;

  let cssText: string | undefined;

  return Object.assign(otherClassName ? otherClassName + ' ' + className : className, {
    _styled: {
      _style: style,
      _scope: scope,
      _className: className,
      _otherClassName: otherClassName,
      get _cssText(): string {
        if (cssText == null) {
          cssText = _getCssText(style, className);
        }

        return cssText;
      },
    },
  });
}

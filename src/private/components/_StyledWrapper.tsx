import React, { useMemo, ReactElement, cloneElement } from 'react';
import { _styleAttributeName } from '../_constants';
import { _getStyleTokens } from '../_getStyleTokens';
import { _getCssText } from '../_getCssText';
import { _getStyledClassName, StyledClassName } from '../_getStyledClassName';
import { _getConfig } from '../_getConfig';
import { _useStyle } from '../_useStyle';

export function _StyledWrapper({
  scope,
  className,
  styleText,
  child,
}: {
  scope: string | undefined;
  className: StyledClassName | undefined;
  styleText: string;
  child: ReactElement;
}): ReactElement {
  const childClassName = child?.props.className;
  const [cacheKey, cssText, styledClassName] = useMemo((): [string, string, string] => {
    const { customHashFunction: getHash } = _getConfig();
    const newTokens = _getStyleTokens(styleText);
    const parent = className?._styled;
    const tokens = [...newTokens, ...(parent?._tokens ?? [])];
    const hash = getHash(tokens.toString());
    const hashedClassName = (scope ? scope + '--' : '') + 'rcij-' + hash;
    const styledClassName = _getStyledClassName(
      tokens,
      hashedClassName,
      [childClassName, parent ? parent._simpleClassName : className].filter((v) => !!v).join(' ')
    );
    const cacheKey = scope ? scope + '/' + hash : hash;
    const cssText = _getCssText(tokens, hashedClassName);

    return [cacheKey, cssText, styledClassName];
  }, [scope, className, styleText, childClassName]);

  return (
    <>
      {_useStyle(cacheKey, cssText) || <style {...{ [_styleAttributeName]: cacheKey }}>{cssText}</style>}
      {cloneElement(child, { className: styledClassName })}
    </>
  );
}
_StyledWrapper.displayName = 'StyledWrapper';

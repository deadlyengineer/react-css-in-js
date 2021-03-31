import React, { cloneElement, ReactElement } from 'react';
import { _Stylesheet } from './_Stylesheet';
import { _useJoinedClassName } from '../_useJoinedClassName';
import { StyledClassName } from '../types/StyledClassName';

export interface IStyledChildProps {
  className: StyledClassName | undefined;
  child: ReactElement;
}

export function _StyledChild({ className, child }: IStyledChildProps): ReactElement {
  // The child class has the "base" style, which is overridden by the
  // incoming class name property.
  const joinedClassName = _useJoinedClassName(className, child.props.className);

  return (
    <>
      {joinedClassName?._styled && joinedClassName._styled._style.length > 0 && (
        <_Stylesheet
          scope={joinedClassName._styled._scope}
          hash={joinedClassName._styled._style._hash}
          cssText={joinedClassName._styled._cssText}
        />
      )}
      {cloneElement(child, { className: joinedClassName })}
    </>
  );
}
_StyledChild.displayName = 'StyledChild';

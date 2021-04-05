import React, { cloneElement, ReactElement } from 'react';
import { _Stylesheet } from './_Stylesheet';
import { _useJoinedClassName } from '../_useJoinedClassName';
import { StyledClassName } from '../types/StyledClassName';

export interface IStyledChildProps {
  _className: StyledClassName | undefined;
  _child: ReactElement;
}

export function _StyledChild({ _className, _child }: IStyledChildProps): ReactElement {
  // The child class has the "base" style, which is overridden by the
  // incoming class name property.
  const joinedClassName = _useJoinedClassName(_className, _child.props.className);

  return (
    <>
      {joinedClassName?._styled && joinedClassName._styled._style.length > 0 && (
        <_Stylesheet
          _scope={joinedClassName._styled._scope}
          _hash={joinedClassName._styled._style._hash}
          _cssText={joinedClassName._styled._cssText}
        />
      )}
      {cloneElement(_child, { className: joinedClassName })}
    </>
  );
}
_StyledChild.displayName = 'StyledChild';

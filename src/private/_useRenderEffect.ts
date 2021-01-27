import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function _useRenderEffect(effect: EffectCallback, deps?: DependencyList): void {
  const gcRef = useRef<void | (() => void | undefined)>();
  const depsRef = useRef<DependencyList | undefined>();
  const prevDeps = depsRef.current;

  depsRef.current = deps;

  if (!isSameDeps(prevDeps, deps)) {
    gcRef.current = effect();
  }

  useEffect(() => gcRef.current, [gcRef.current]);
}

function isSameDeps(prevDeps: DependencyList | undefined, deps: DependencyList | undefined): boolean {
  if (prevDeps == null || deps == null) return false;

  for (let i = 0; i < prevDeps.length && i < deps.length; i++) {
    if (is(deps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function is(x: any, y: any): boolean {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}

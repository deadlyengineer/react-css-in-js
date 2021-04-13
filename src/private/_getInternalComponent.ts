import { ReactElement } from 'react';
import { _metaKey } from './_constants';

export type RCIJFC<TProps> = ((props: TProps) => ReactElement | null) & {
  displayName: string;
};

export function _getInternalComponent<TProps>(
  id: string,
  component: (props: TProps) => ReactElement | null | void = () => null
): RCIJFC<TProps> {
  return Object.assign((props: TProps) => (component(props) as ReactElement | null | undefined) ?? null, {
    displayName: `${_metaKey}-${id}`,
  });
}

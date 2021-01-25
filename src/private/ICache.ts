import { IStyleManager } from '../IStyleManager';

export interface ICache {
  readonly manager: IStyleManager | null;
  readonly refCounts: Map<string, number>;
}

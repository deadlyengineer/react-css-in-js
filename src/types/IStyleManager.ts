import { IStyleDehydrated } from './IStyleDehydrated';

export interface IStyleManager {
  register(key: string, cssText: string): void;
  unregister(key: string): void;
  hydrate(styles: IStyleDehydrated[]): void;
}

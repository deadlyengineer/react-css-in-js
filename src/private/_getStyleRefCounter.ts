import { _globals } from './_globals';

export interface IStyleRefCounter {
  /**
   * Adds one to the reference count for the key, and returns true
   * if the ref count was previously zero, otherwise false.
   */
  ref(key: string): boolean;

  /**
   * Removes one from the reference count for the key, and returns
   * true if the ref count reaches zero, otherwise false.
   */
  unref(key: string): boolean;

  /**
   * Returns true if there is at least one reference to the key,
   * otherwise false.
   */
  exists(key: string): boolean;
}

export function _getStyleRefCounter(): IStyleRefCounter {
  if (!_getStyleRefCounter._instance) {
    _getStyleRefCounter._instance = {
      ref(key) {
        const count = _globals.s.get(key) ?? 0;
        _globals.s.set(key, count + 1);
        return count === 0;
      },
      unref(key) {
        const count = _globals.s.get(key) ?? 0;
        count > 0 && _globals.s.set(key, count - 1);

        if (count === 1) {
          _globals.s.delete(key);
          return true;
        }

        count > 0 && _globals.s.set(key, count - 1);

        return false;
      },
      exists(key) {
        return _globals.s.has(key);
      },
    };
  }

  return _getStyleRefCounter._instance;
}
_getStyleRefCounter._instance = undefined as undefined | IStyleRefCounter;

import React, { createContext, useContext } from 'react';
import { ITheme } from './ITheme';

export interface IThemeProviderProps<T> {
  theme: T | ((current: T) => void);
  children?: React.ReactNode;
}

export interface IThemeConsumerProps<T> {
  children: (theme: T) => React.ReactNode;
}

export type UseTheme<T> = () => T;
export type ThemeProvider<T> = React.VFC<IThemeProviderProps<T>>;
export type ThemeConsumer<T> = React.VFC<IThemeConsumerProps<T>>;

/**
 * Create a theme hook and provider with the given default theme values.
 */
export function createTheme<T extends ITheme>(defaultTheme: T): [UseTheme<T>, ThemeProvider<T>, ThemeConsumer<T>] {
  const Context = createContext<T>(JSON.parse(JSON.stringify(defaultTheme)));

  function useTheme() {
    return useContext(Context);
  }

  const ThemeProvider: ThemeProvider<T> = ({ theme, children }) => {
    const currentTheme = useTheme();
    const value =
      typeof theme === 'function' ? theme(JSON.parse(JSON.stringify(currentTheme))) : JSON.parse(JSON.stringify(theme));

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const ThemeConsumer: ThemeConsumer<T> = ({ children }) => {
    const theme = useTheme();

    return <>{children(theme)}</>;
  };

  return [useTheme, ThemeProvider, ThemeConsumer];
}

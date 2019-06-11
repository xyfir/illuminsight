import { createMuiTheme } from '@material-ui/core/styles';
import { createContext } from 'react';

export type ThemeType = 'light' | 'dark';

export type ThemeTypeContextValue = {
  type: ThemeType;
  setType(type: ThemeType): void;
};

export const themes = {
  light: createMuiTheme({
    palette: {
      type: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#64dd17' }
    }
  }),
  dark: createMuiTheme({
    palette: {
      type: 'dark',
      primary: { main: '#1976d2' },
      secondary: { main: '#64dd17' }
    }
  })
};

export const ThemeTypeContext = createContext<ThemeTypeContextValue>({
  type: 'light',
  setType() {}
});

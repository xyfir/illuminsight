import { createMuiTheme } from '@material-ui/core/styles';
import { createContext } from 'react';

export type ThemeType = 'light' | 'dark';

export type ToggleThemeContextValue = () => void;

export const themes = {
  light: createMuiTheme({
    palette: {
      type: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#00e5ff' },
    },
  }),
  dark: createMuiTheme({
    palette: {
      type: 'dark',
      primary: { main: '#1976d2' },
      secondary: { main: '#00e5ff' },
    },
  }),
};

export const ToggleThemeContext = createContext<ToggleThemeContextValue>(
  () => 0,
);

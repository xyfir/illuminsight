import { createMuiTheme } from '@material-ui/core/styles';

export type ThemeType = 'light' | 'dark';

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

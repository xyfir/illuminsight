import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: localStorage.theme,
    primary: { main: '#1976d2' },
    secondary: { main: '#64dd17' }
  }
});

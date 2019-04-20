import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    type: localStorage.theme,
    primary: { main: '#212121' },
    secondary: { main: '#fafafa' }
  }
});

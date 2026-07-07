import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4285F4', // Google Blue
    },
    secondary: {
      main: '#34A853', // Google Green (Healthy)
    },
    error: {
      main: '#EA4335', // Google Red (Critical Alert)
    },
    background: {
      default: '#0B0E11',
      paper: '#15191C',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
  },
  shape: {
    borderRadius: 12,
  },
});
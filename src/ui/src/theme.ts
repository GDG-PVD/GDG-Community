import { createTheme } from '@mui/material/styles';

// Google colors
const googleBlue = '#4285F4';
const googleRed = '#EA4335';
const googleYellow = '#FBBC05';
const googleGreen = '#34A853';

// Custom theme based on Google Developer Groups branding
const theme = createTheme({
  palette: {
    primary: {
      main: googleBlue,
      light: '#80B4FF',
      dark: '#0D5BDC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: googleRed,
      light: '#FF8273',
      dark: '#C51E1E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: googleRed,
    },
    warning: {
      main: googleYellow,
    },
    success: {
      main: googleGreen,
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '8px 22px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
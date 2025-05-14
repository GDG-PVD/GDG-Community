import { createTheme, alpha } from '@mui/material/styles';

// Google colors - Material Design 3 Expressive
const primaryBlue = {
  50: '#e8f1ff',
  100: '#d4e5ff',
  200: '#a7c9ff',
  300: '#7cacff',
  400: '#5490ff',
  500: '#4285F4', // Google Blue
  600: '#3b6bd6',
  700: '#2d52b8',
  800: '#203a9a',
  900: '#12267c',
};

const secondaryRed = {
  50: '#ffece9',
  100: '#ffd4cd',
  200: '#ffa79b',
  300: '#ff7b69',
  400: '#ff4c37',
  500: '#EA4335', // Google Red
  600: '#d13c2e',
  700: '#b73528',
  800: '#9c2e21',
  900: '#82271b',
};

const googleYellow = '#FBBC05';
const googleGreen = '#34A853';

// Custom theme based on Material Design 3 Expressive
const theme = createTheme({
  palette: {
    primary: {
      main: primaryBlue[500],
      light: primaryBlue[300],
      dark: primaryBlue[700],
      contrastText: '#FFFFFF',
      ...primaryBlue
    },
    secondary: {
      main: secondaryRed[500],
      light: secondaryRed[300],
      dark: secondaryRed[700],
      contrastText: '#FFFFFF',
      ...secondaryRed
    },
    error: {
      main: secondaryRed[500],
    },
    warning: {
      main: googleYellow,
    },
    success: {
      main: googleGreen,
    },
    background: {
      default: '#FAFBFF', // Slightly blue-tinted background for more dynamic feel
      paper: '#FFFFFF',
    },
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#BDC1C6',
      500: '#9AA0A6',
      600: '#80868B',
      700: '#5F6368',
      800: '#3C4043',
      900: '#202124',
    },
    text: {
      primary: '#202124',
      secondary: '#5F6368',
    },
  },
  typography: {
    fontFamily: '"Google Sans Text", "Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.0125em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0.00714em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02857em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.01071em',
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 500,
      lineHeight: 1.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.08),0px 1px 1px 0px rgba(0,0,0,0.06),0px 1px 3px 0px rgba(0,0,0,0.04)',
    '0px 3px 1px -2px rgba(0,0,0,0.08),0px 2px 2px 0px rgba(0,0,0,0.06),0px 1px 5px 0px rgba(0,0,0,0.04)',
    '0px 3px 3px -2px rgba(0,0,0,0.08),0px 3px 4px 0px rgba(0,0,0,0.06),0px 1px 8px 0px rgba(0,0,0,0.04)',
    '0px 2px 4px -1px rgba(0,0,0,0.08),0px 4px 5px 0px rgba(0,0,0,0.06),0px 1px 10px 0px rgba(0,0,0,0.04)',
    '0px 3px 5px -1px rgba(0,0,0,0.08),0px 5px 8px 0px rgba(0,0,0,0.06),0px 1px 14px 0px rgba(0,0,0,0.04)',
    '0px 3px 5px -1px rgba(0,0,0,0.08),0px 6px 10px 0px rgba(0,0,0,0.06),0px 1px 18px 0px rgba(0,0,0,0.04)',
    '0px 4px 5px -2px rgba(0,0,0,0.08),0px 7px 10px 1px rgba(0,0,0,0.06),0px 2px 16px 1px rgba(0,0,0,0.04)',
    '0px 5px 5px -3px rgba(0,0,0,0.08),0px 8px 10px 1px rgba(0,0,0,0.06),0px 3px 14px 2px rgba(0,0,0,0.04)',
    '0px 5px 6px -3px rgba(0,0,0,0.08),0px 9px 12px 1px rgba(0,0,0,0.06),0px 3px 16px 2px rgba(0,0,0,0.04)',
    '0px 6px 6px -3px rgba(0,0,0,0.08),0px 10px 14px 1px rgba(0,0,0,0.06),0px 4px 18px 3px rgba(0,0,0,0.04)',
    '0px 6px 7px -4px rgba(0,0,0,0.08),0px 11px 15px 1px rgba(0,0,0,0.06),0px 4px 20px 3px rgba(0,0,0,0.04)',
    '0px 7px 8px -4px rgba(0,0,0,0.08),0px 12px 17px 2px rgba(0,0,0,0.06),0px 5px 22px 4px rgba(0,0,0,0.04)',
    '0px 7px 8px -4px rgba(0,0,0,0.08),0px 13px 19px 2px rgba(0,0,0,0.06),0px 5px 24px 4px rgba(0,0,0,0.04)',
    '0px 7px 9px -4px rgba(0,0,0,0.08),0px 14px 21px 2px rgba(0,0,0,0.06),0px 5px 26px 4px rgba(0,0,0,0.04)',
    '0px 8px 9px -5px rgba(0,0,0,0.08),0px 15px 22px 2px rgba(0,0,0,0.06),0px 6px 28px 5px rgba(0,0,0,0.04)',
    '0px 8px 10px -5px rgba(0,0,0,0.08),0px 16px 24px 2px rgba(0,0,0,0.06),0px 6px 30px 5px rgba(0,0,0,0.04)',
    '0px 8px 11px -5px rgba(0,0,0,0.08),0px 17px 26px 2px rgba(0,0,0,0.06),0px 6px 32px 5px rgba(0,0,0,0.04)',
    '0px 9px 11px -5px rgba(0,0,0,0.08),0px 18px 28px 2px rgba(0,0,0,0.06),0px 7px 34px 6px rgba(0,0,0,0.04)',
    '0px 9px 12px -6px rgba(0,0,0,0.08),0px 19px 29px 2px rgba(0,0,0,0.06),0px 7px 36px 6px rgba(0,0,0,0.04)',
    '0px 10px 13px -6px rgba(0,0,0,0.08),0px 20px 31px 3px rgba(0,0,0,0.06),0px 8px 38px 7px rgba(0,0,0,0.04)',
    '0px 10px 13px -6px rgba(0,0,0,0.08),0px 21px 33px 3px rgba(0,0,0,0.06),0px 8px 40px 7px rgba(0,0,0,0.04)',
    '0px 10px 14px -6px rgba(0,0,0,0.08),0px 22px 35px 3px rgba(0,0,0,0.06),0px 8px 42px 7px rgba(0,0,0,0.04)',
    '0px 11px 14px -7px rgba(0,0,0,0.08),0px 23px 36px 3px rgba(0,0,0,0.06),0px 9px 44px 8px rgba(0,0,0,0.04)',
    '0px 11px 15px -7px rgba(0,0,0,0.08),0px 24px 38px 3px rgba(0,0,0,0.06),0px 9px 46px 8px rgba(0,0,0,0.04)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: alpha(primaryBlue[500], 0.3),
        },
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(primaryBlue[500], 0.2),
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: alpha(primaryBlue[500], 0.3),
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(66, 133, 244, 0.2)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(66, 133, 244, 0.3)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: '0px 2px 8px rgba(66, 133, 244, 0.2)',
            transform: 'translateY(1px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: alpha(primaryBlue[500], 0.04),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(primaryBlue[500], 0.04),
          },
        },
        // M3 Expressive buttons have more emphasis on color transitions
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryBlue[600]} 0%, ${primaryBlue[500]} 100%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${primaryBlue[500]} 0%, ${primaryBlue[400]} 100%)`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(45deg, ${secondaryRed[600]} 0%, ${secondaryRed[500]} 100%)`,
          '&:hover': {
            background: `linear-gradient(45deg, ${secondaryRed[500]} 0%, ${secondaryRed[400]} 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 24,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        outlined: {
          borderColor: '#E8EAED',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        colorPrimary: {
          backgroundColor: alpha(primaryBlue[500], 0.12),
          color: primaryBlue[700],
          '&:hover': {
            backgroundColor: alpha(primaryBlue[500], 0.18),
          },
        },
        colorSecondary: {
          backgroundColor: alpha(secondaryRed[500], 0.12),
          color: secondaryRed[700],
          '&:hover': {
            backgroundColor: alpha(secondaryRed[500], 0.18),
          },
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
        colorDefault: {
          backgroundColor: alpha(primaryBlue[500], 0.08),
          color: primaryBlue[700],
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 46,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: primaryBlue[500],
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        },
        track: {
          opacity: 1,
          backgroundColor: '#BDC1C6',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E8EAED',
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: primaryBlue[300],
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryBlue[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          paddingLeft: 20,
          paddingRight: 20,
          borderRadius: '12px 12px 0 0',
          '&.Mui-selected': {
            color: primaryBlue[600],
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
        standardSuccess: {
          backgroundColor: alpha(googleGreen, 0.1),
          color: '#1E6E36',
        },
        standardError: {
          backgroundColor: alpha(secondaryRed[500], 0.1),
          color: secondaryRed[800],
        },
        standardWarning: {
          backgroundColor: alpha(googleYellow, 0.1),
          color: '#7A4E00',
        },
        standardInfo: {
          backgroundColor: alpha(primaryBlue[500], 0.1),
          color: primaryBlue[800],
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(32, 33, 36, 0.9)',
          padding: '8px 12px',
          fontSize: '0.75rem',
          borderRadius: 8,
        },
        arrow: {
          color: 'rgba(32, 33, 36, 0.9)',
        },
      },
    },
  },
});

export default theme;
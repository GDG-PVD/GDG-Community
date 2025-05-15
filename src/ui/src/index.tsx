import React, { ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button } from '@mui/material';
import App from './App';
import { FirebaseProvider } from './contexts/FirebaseContext';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import './index.css';

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 5 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" paragraph>
            The application encountered an error. This is likely related to Firebase configuration.
          </Typography>
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3, fontFamily: 'monospace' }}>
            <Typography variant="body2">
              {this.state.error?.toString()}
            </Typography>
          </Box>
          <Typography variant="h6" gutterBottom>
            Troubleshooting steps:
          </Typography>
          <ul>
            <li>
              <Typography>
                Ensure Firebase Storage is set up in your Firebase Console
              </Typography>
            </li>
            <li>
              <Typography>
                Verify that your Firebase API keys are correct in .env.local
              </Typography>
            </li>
            <li>
              <Typography>
                Check that Firebase Authentication is enabled with Email/Password provider
              </Typography>
            </li>
          </ul>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              window.location.href = '/test-dashboard';
            }}
            sx={{ mt: 2 }}
          >
            Go to Test Dashboard
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Create a client for React Query
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <FirebaseProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </FirebaseProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

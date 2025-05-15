import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AuthDebug: React.FC = () => {
  const mockAuthEnabled = process.env.REACT_APP_MOCK_AUTH_ENABLED;
  const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  
  return (
    <Paper sx={{ position: 'fixed', bottom: 20, right: 20, p: 2, bgcolor: 'error.light', color: 'white' }}>
      <Typography variant="h6">Debug Info</Typography>
      <Typography>Mock Auth: {mockAuthEnabled}</Typography>
      <Typography>API Key: {apiKey ? 'Set' : 'Not Set'}</Typography>
      <Typography>Project ID: {projectId}</Typography>
    </Paper>
  );
};

export default AuthDebug;
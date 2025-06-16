import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Dashboard from './pages/Dashboard';
import ContentCalendar from './pages/ContentCalendar';
import Analytics from './pages/Analytics';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import AuthDebug from './components/AuthDebug';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Direct test route bypassing ProtectedRoute */}
        <Route path="/test-dashboard" element={
          <Box sx={{ p: 3 }}>
            <Typography variant="h4">Test Dashboard</Typography>
            <Typography>Firebase Auth Status: {user ? 'Logged In' : 'Not Logged In'}</Typography>
            <Button variant="contained" onClick={() => window.location.href='/dashboard'}>
              Go to Real Dashboard
            </Button>
          </Box>
        } />
        
        <Route element={<ProtectedRoute user={user} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthDebug />
    </>
  );
};

export default App;

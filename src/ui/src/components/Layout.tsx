import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Analytics as AnalyticsIcon,
  DesignServices as TemplatesIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import CompanionChatbox from './CompanionChatbox';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}));

interface NavItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [chatOpen, setChatOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navItems: NavItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Content Calendar', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Templates', icon: <TemplatesIcon />, path: '/templates' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const toggleChatbox = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          backgroundColor: 'white',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" color="primary" sx={{ flexGrow: 1 }}>
            GDG Community Companion
          </Typography>

          {/* Chat Button */}
          <Tooltip title="Ask the GDG Companion">
            <IconButton color="primary" onClick={toggleChatbox} sx={{ mx: 1 }}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton sx={{ mx: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* Profile Menu */}
          <Tooltip title="Account menu">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1 }}
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              {userProfile?.photoURL ? (
                <Avatar 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: theme.palette.primary.main 
                  }}
                >
                  {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side Navigation Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            boxShadow: isMobile ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          {/* Chapter Info */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              CHAPTER
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {userProfile?.chapterId ? `GDG ${userProfile.chapterId.split('-')[1].charAt(0).toUpperCase() + userProfile.chapterId.split('-')[1].slice(1)}` : 'GDG Chapter'}
            </Typography>
          </Box>
          <Divider />
          
          {/* Navigation Items */}
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderLeft: location.pathname === item.path ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(66, 133, 244, 0.08)',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 0.12)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 500 : 400,
                      color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ mt: 2 }} />
          
          {/* User Role */}
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Logged in as
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {userProfile?.displayName || user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" textTransform="uppercase">
              {userProfile?.role}
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Main open={open && !isMobile}>
        <Toolbar />
        <Box sx={{ py: 2 }}>
          <Outlet />
        </Box>
      </Main>
      
      {/* Companion Chatbox */}
      <CompanionChatbox open={chatOpen} onClose={() => setChatOpen(false)} />
    </Box>
  );
};

export default Layout;
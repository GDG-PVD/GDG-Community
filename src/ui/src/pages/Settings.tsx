import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  ColorLens as ColorLensIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { userProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  // Mock data
  const [settings, setSettings] = useState({
    chapterName: 'GDG Providence',
    description: 'Google Developer Group serving the Providence area with technical events and workshops.',
    colors: {
      primary: '#4285F4',
      secondary: '#EA4335',
    },
    defaultPlatforms: ['twitter', 'linkedin'],
    autoScheduling: true,
    approvalRequired: true,
    notificationEmails: ['admin@gdgprovidence.com'],
  });

  const [members, setMembers] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', photoURL: null },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor', photoURL: null },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'viewer', photoURL: null },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (colorField: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorField]: value,
      },
    }));
  };

  const handleTogglePlatform = (platform: string) => {
    setSettings((prev) => {
      const platforms = [...prev.defaultPlatforms];
      const index = platforms.indexOf(platform);
      
      if (index > -1) {
        platforms.splice(index, 1);
      } else {
        platforms.push(platform);
      }
      
      return {
        ...prev,
        defaultPlatforms: platforms,
      };
    });
  };

  const handleSaveSettings = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Settings saved successfully');
    }, 1000);
  };

  const handleOpenMemberDialog = () => {
    setMemberDialogOpen(true);
  };

  const handleCloseMemberDialog = () => {
    setMemberDialogOpen(false);
  };

  const handleAddMember = () => {
    // Logic for adding a member would go here
    setMemberDialogOpen(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'editor':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'instagram':
        return <InstagramIcon />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="500">
          Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Settings Categories */}
      <Paper sx={{ mb: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<StorageIcon />} label="General" />
          <Tab icon={<ColorLensIcon />} label="Appearance" />
          <Tab icon={<PersonIcon />} label="Team Members" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<LanguageIcon />} label="Integration" />
        </Tabs>
      </Paper>

      {/* Tab 0: General Settings */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Chapter Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Chapter Name"
                fullWidth
                value={settings.chapterName}
                onChange={(e) => handleSettingsChange('chapterName', e.target.value)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Website URL"
                fullWidth
                value="https://gdg.community.dev/providence"
                disabled
                margin="normal"
                helperText="This is your official GDG chapter URL"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Chapter Description"
                fullWidth
                multiline
                rows={3}
                value={settings.description}
                onChange={(e) => handleSettingsChange('description', e.target.value)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Content Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoScheduling}
                    onChange={(e) => handleSettingsChange('autoScheduling', e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable auto-scheduling for content"
              />
              <Typography variant="body2" color="text.secondary">
                Allow the system to automatically schedule posts based on optimal timing
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.approvalRequired}
                    onChange={(e) => handleSettingsChange('approvalRequired', e.target.checked)}
                    color="primary"
                  />
                }
                label="Require approval for posts"
              />
              <Typography variant="body2" color="text.secondary">
                Posts will require admin approval before publishing
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Default Social Platforms
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select which platforms should be enabled by default when creating content
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Card 
                  variant={settings.defaultPlatforms.includes('twitter') ? 'elevation' : 'outlined'} 
                  sx={{ 
                    width: 100, 
                    cursor: 'pointer',
                    bgcolor: settings.defaultPlatforms.includes('twitter') ? 'primary.light' : 'background.paper',
                  }}
                  onClick={() => handleTogglePlatform('twitter')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <TwitterIcon fontSize="large" color={settings.defaultPlatforms.includes('twitter') ? 'primary' : 'action'} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Twitter
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card 
                  variant={settings.defaultPlatforms.includes('linkedin') ? 'elevation' : 'outlined'} 
                  sx={{ 
                    width: 100, 
                    cursor: 'pointer',
                    bgcolor: settings.defaultPlatforms.includes('linkedin') ? 'primary.light' : 'background.paper',
                  }}
                  onClick={() => handleTogglePlatform('linkedin')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <LinkedInIcon fontSize="large" color={settings.defaultPlatforms.includes('linkedin') ? 'primary' : 'action'} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      LinkedIn
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card 
                  variant={settings.defaultPlatforms.includes('facebook') ? 'elevation' : 'outlined'} 
                  sx={{ 
                    width: 100, 
                    cursor: 'pointer',
                    bgcolor: settings.defaultPlatforms.includes('facebook') ? 'primary.light' : 'background.paper',
                  }}
                  onClick={() => handleTogglePlatform('facebook')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <FacebookIcon fontSize="large" color={settings.defaultPlatforms.includes('facebook') ? 'primary' : 'action'} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Facebook
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card 
                  variant={settings.defaultPlatforms.includes('instagram') ? 'elevation' : 'outlined'} 
                  sx={{ 
                    width: 100, 
                    cursor: 'pointer',
                    bgcolor: settings.defaultPlatforms.includes('instagram') ? 'primary.light' : 'background.paper',
                  }}
                  onClick={() => handleTogglePlatform('instagram')}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <InstagramIcon fontSize="large" color={settings.defaultPlatforms.includes('instagram') ? 'primary' : 'action'} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Instagram
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tab 1: Appearance Settings */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Brand Colors
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Customize the colors used throughout your community companion
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Primary Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: settings.colors.primary,
                      mr: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <TextField
                    value={settings.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <input
                      type="color"
                      value={settings.colors.primary}
                      onChange={(e) => handleColorChange('primary', e.target.value)}
                      style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Secondary Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: settings.colors.secondary,
                      mr: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <TextField
                    value={settings.colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    size="small"
                    sx={{ width: 120 }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <input
                      type="color"
                      value={settings.colors.secondary}
                      onChange={(e) => handleColorChange('secondary', e.target.value)}
                      style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Chapter Logo
                </Typography>
                <Button variant="outlined" startIcon={<RefreshIcon />}>
                  Reset to Default
                </Button>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src=""
                  alt={settings.chapterName}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {settings.chapterName.charAt(0)}
                </Avatar>
                <Box>
                  <Button variant="contained" component="label" sx={{ mr: 2 }}>
                    Upload Logo
                    <input type="file" hidden accept="image/*" />
                  </Button>
                  <Button variant="outlined" color="error">
                    Remove
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Recommended size: 400x400px, max 2MB
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tab 2: Team Members */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Team Members
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenMemberDialog}
            >
              Add Member
            </Button>
          </Box>
          
          <List>
            {members.map((member) => (
              <ListItem
                key={member.id}
                divider
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={member.photoURL || ''}>
                    {member.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={
                    <>
                      {member.email}
                      <Chip
                        label={member.role}
                        size="small"
                        color={getRoleColor(member.role) as any}
                        sx={{ ml: 1 }}
                      />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Role Information:
            </Typography>
            <Typography variant="body2">
              • <strong>Admin:</strong> Full access to all features, including user management
            </Typography>
            <Typography variant="body2">
              • <strong>Editor:</strong> Can create and publish content, but cannot manage users
            </Typography>
            <Typography variant="body2">
              • <strong>Viewer:</strong> Read-only access to content and analytics
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Tab 3-5: Placeholders */}
      {tabValue > 2 && (
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
          <Typography variant="h6" gutterBottom>
            {tabValue === 3 ? 'Notifications' : 
             tabValue === 4 ? 'Security' : 
             'Integrations'}
          </Typography>
          <Typography variant="body1">
            This section will be available in a future update.
          </Typography>
        </Paper>
      )}

      {/* Add Member Dialog */}
      <Dialog open={memberDialogOpen} onClose={handleCloseMemberDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                type="email"
                placeholder="email@example.com"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Role"
                fullWidth
                defaultValue="viewer"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMemberDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMember}>
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock data
const mockTemplates = [
  {
    id: '1',
    name: 'Event Announcement',
    description: 'Standard template for announcing upcoming events',
    type: 'event-announcement',
    template: 'Join us for {event_name} on {date} at {time}! {description} Register now: {link}',
    platforms: ['twitter', 'linkedin', 'facebook'],
    variables: ['event_name', 'date', 'time', 'description', 'link'],
    created_by: 'user1',
    created_at: '2025-04-10T12:00:00Z',
  },
  {
    id: '2',
    name: 'Workshop Promotion',
    description: 'Template for promoting workshops with speaker info',
    type: 'event-announcement',
    template: 'Don\'t miss our {topic} workshop with {speaker} on {date}! Learn {learning_points} and boost your skills. Register: {link} #GDG #DevWorkshop',
    platforms: ['twitter', 'linkedin'],
    variables: ['topic', 'speaker', 'date', 'learning_points', 'link'],
    created_by: 'user2',
    created_at: '2025-04-15T14:30:00Z',
  },
  {
    id: '3',
    name: 'Event Recap',
    description: 'Template for posting event summaries after completion',
    type: 'event-recap',
    template: 'Thanks to everyone who joined our {event_name} yesterday! {highlights} Special thanks to {speakers} for sharing their knowledge. #GDG #CommunityEvent',
    platforms: ['twitter', 'linkedin', 'facebook', 'instagram'],
    variables: ['event_name', 'highlights', 'speakers'],
    created_by: 'user1',
    created_at: '2025-04-20T10:15:00Z',
  },
];

const Templates: React.FC = () => {
  const { userProfile } = useAuth();
  const [templates, setTemplates] = useState(mockTemplates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateType, setTemplateType] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTemplateType(event.target.value);
  };

  const handlePlatformChange = (event: SelectChangeEvent<string[]>) => {
    setSelectedPlatforms(
      typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
    );
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setTemplateType('event-announcement');
    setSelectedPlatforms(['twitter', 'linkedin']);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateTemplate = () => {
    // Logic to create a new template would go here
    setDialogOpen(false);
  };

  const filterTemplatesByType = (type: string) => {
    if (type === 'all') return templates;
    return templates.filter(template => template.type === type);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />;
      case 'linkedin':
        return <LinkedInIcon fontSize="small" sx={{ color: '#0077B5' }} />;
      case 'facebook':
        return <FacebookIcon fontSize="small" sx={{ color: '#4267B2' }} />;
      case 'instagram':
        return <InstagramIcon fontSize="small" sx={{ color: '#E1306C' }} />;
      default:
        return <></>; // Return empty React fragment instead of null
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="500">
          Content Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Create Template
        </Button>
      </Box>

      {/* Template Categories */}
      <Paper sx={{ mb: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Templates" />
          <Tab label="Event Announcements" />
          <Tab label="Event Recaps" />
          <Tab label="Custom Templates" />
        </Tabs>
      </Paper>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filterTemplatesByType(
          tabValue === 0 ? 'all' : 
          tabValue === 1 ? 'event-announcement' : 
          tabValue === 2 ? 'event-recap' : 'custom'
        ).map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Chip 
                    label={template.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    mb: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 0.5,
                  }}>
                    <IconButton size="small">
                      <FileCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <CodeIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {template.template}
                </Paper>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Platforms:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {template.platforms.map((platform) => (
                      <Chip
                        key={platform}
                        icon={getPlatformIcon(platform)}
                        label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Variables:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {template.variables.map((variable) => (
                      <Chip
                        key={variable}
                        label={variable}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />} 
                  onClick={() => {/* Edit template */}}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  startIcon={<FileCopyIcon />} 
                  onClick={() => {/* Duplicate template */}}
                >
                  Duplicate
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => {/* Delete template */}}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Template Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Template</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Template Name"
                fullWidth
                placeholder="e.g., Event Announcement"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                placeholder="Brief description of this template's purpose"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Template Type</InputLabel>
                <Select
                  value={templateType}
                  label="Template Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="event-announcement">Event Announcement</MenuItem>
                  <MenuItem value="event-recap">Event Recap</MenuItem>
                  <MenuItem value="news">News & Updates</MenuItem>
                  <MenuItem value="welcome">Welcome Message</MenuItem>
                  <MenuItem value="custom">Custom Template</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Platforms</InputLabel>
                <Select
                  multiple
                  value={selectedPlatforms}
                  label="Platforms"
                  onChange={handlePlatformChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="twitter">
                    <Checkbox checked={selectedPlatforms.indexOf('twitter') > -1} />
                    <ListItemIcon>
                      <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Twitter" />
                  </MenuItem>
                  <MenuItem value="linkedin">
                    <Checkbox checked={selectedPlatforms.indexOf('linkedin') > -1} />
                    <ListItemIcon>
                      <LinkedInIcon fontSize="small" sx={{ color: '#0077B5' }} />
                    </ListItemIcon>
                    <ListItemText primary="LinkedIn" />
                  </MenuItem>
                  <MenuItem value="facebook">
                    <Checkbox checked={selectedPlatforms.indexOf('facebook') > -1} />
                    <ListItemIcon>
                      <FacebookIcon fontSize="small" sx={{ color: '#4267B2' }} />
                    </ListItemIcon>
                    <ListItemText primary="Facebook" />
                  </MenuItem>
                  <MenuItem value="instagram">
                    <Checkbox checked={selectedPlatforms.indexOf('instagram') > -1} />
                    <ListItemIcon>
                      <InstagramIcon fontSize="small" sx={{ color: '#E1306C' }} />
                    </ListItemIcon>
                    <ListItemText primary="Instagram" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Template Content"
                fullWidth
                multiline
                rows={4}
                placeholder="Write your template using variables like {event_name}, {date}, etc."
                helperText="Use curly braces {} to denote variables that will be replaced with actual content."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Variables Preview:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip label="event_name" size="small" color="secondary" variant="outlined" />
                <Chip label="date" size="small" color="secondary" variant="outlined" />
                <Chip label="time" size="small" color="secondary" variant="outlined" />
                <Chip label="description" size="small" color="secondary" variant="outlined" />
                <Chip label="link" size="small" color="secondary" variant="outlined" />
                <IconButton size="small">
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateTemplate}
          >
            Create Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Templates;
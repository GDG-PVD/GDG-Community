import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Send as SendIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Schedule as ScheduleIcon,
  Preview as PreviewIcon,
  Psychology as PsychologyIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';
import { GDGEvent } from '../types';
import { EventsService } from '../services/firebaseService';

interface GeneratedContent {
  platform: 'linkedin' | 'twitter' | 'bluesky';
  content: string;
  hashtags: string[];
  tone: string;
  length: number;
  engagement_score?: number;
  memory_context?: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const GenerateContent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<GDGEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Content generation options
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'bluesky'>('linkedin');
  const [tone, setTone] = useState<string>('professional');
  const [useMemory, setUseMemory] = useState(true);
  const [useKnowledge, setUseKnowledge] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Generated content
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const eventData = await EventsService.getById(eventId);
      if (eventData) {
        setEvent(eventData);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      setError('Failed to load event');
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!event) return;

    setGenerating(true);
    setError(null);
    
    try {
      // Mock AI content generation
      // In a real implementation, this would call your agent service
      const mockContent: GeneratedContent = {
        platform,
        content: `🚀 Exciting news! Join us for "${event.title}" 
        
${event.description}

📅 ${new Date(event.date).toLocaleDateString()}
📍 ${event.location || 'Virtual Event'}

This event is perfect for developers looking to enhance their ${event.type} skills. Don't miss out on this opportunity to learn and network with the GDG community!

Register now: [Event Link]`,
        hashtags: ['#GDG', `#${event.type}`, '#CommunityEvent', '#TechEvent', '#Learning'],
        tone,
        length: 280,
        engagement_score: 0.85,
        memory_context: useMemory ? ['Previous events had high engagement with technical content', 'Community prefers detailed agendas'] : []
      };

      setGeneratedContent([mockContent]);
      setSuccess('Content generated successfully!');
    } catch (err) {
      setError('Failed to generate content');
      console.error('Error generating content:', err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setSuccess('Content copied to clipboard!');
  };

  const handleEdit = (content: GeneratedContent) => {
    setSelectedContent(content);
    setEditedContent(content.content);
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (selectedContent) {
      const updatedContent = { ...selectedContent, content: editedContent };
      setGeneratedContent(prev => 
        prev.map(c => c === selectedContent ? updatedContent : c)
      );
      setEditDialogOpen(false);
      setSuccess('Content updated successfully!');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'bluesky':
        return <TwitterIcon sx={{ color: '#00D4FF' }} />;
      default:
        return <TwitterIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box p={3}>
        <Alert severity="error">Event not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AIIcon color="primary" />
          AI Content Generator
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Generate engaging social media content for "{event.title}"
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Generation Options */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PsychologyIcon />
              Generation Options
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Platform</InputLabel>
              <Select
                value={platform}
                label="Platform"
                onChange={(e) => setPlatform(e.target.value as any)}
              >
                <MenuItem value="linkedin">
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinkedInIcon sx={{ color: '#0077B5' }} />
                    LinkedIn
                  </Box>
                </MenuItem>
                <MenuItem value="bluesky">
                  <Box display="flex" alignItems="center" gap={1}>
                    <TwitterIcon sx={{ color: '#00D4FF' }} />
                    Bluesky
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Tone</InputLabel>
              <Select
                value={tone}
                label="Tone"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="exciting">Exciting</MenuItem>
                <MenuItem value="informative">Informative</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
              </Select>
            </FormControl>

            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={useMemory} 
                    onChange={(e) => setUseMemory(e.target.checked)}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <MemoryIcon fontSize="small" />
                    Use Agent Memory
                  </Box>
                }
              />
            </Box>

            <Box mt={1}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={useKnowledge} 
                    onChange={(e) => setUseKnowledge(e.target.checked)}
                  />
                }
                label="Use Knowledge Base"
              />
            </Box>

            <TextField
              fullWidth
              margin="normal"
              label="Custom Prompt (optional)"
              multiline
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Add specific instructions for content generation..."
            />

            <Button
              fullWidth
              variant="contained"
              startIcon={generating ? <CircularProgress size={20} /> : <AIIcon />}
              onClick={generateContent}
              disabled={generating}
              sx={{ mt: 2 }}
            >
              {generating ? 'Generating...' : 'Generate Content'}
            </Button>
          </Paper>
        </Grid>

        {/* Generated Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated Content
            </Typography>

            {generatedContent.length === 0 ? (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="300px"
                textAlign="center"
              >
                <AIIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No content generated yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use the options on the left to generate AI-powered social media content
                </Typography>
              </Box>
            ) : (
              <Box>
                {generatedContent.map((content, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPlatformIcon(content.platform)}
                          <Typography variant="h6" component="span">
                            {content.platform.charAt(0).toUpperCase() + content.platform.slice(1)}
                          </Typography>
                          <Chip 
                            label={content.tone} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                        {content.engagement_score && (
                          <Chip 
                            label={`${Math.round(content.engagement_score * 100)}% engagement`}
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>

                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          mb: 2,
                          p: 2,
                          bgcolor: 'grey.50',
                          borderRadius: 1
                        }}
                      >
                        {content.content}
                      </Typography>

                      {content.hashtags.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Hashtags:
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {content.hashtags.map((tag, tagIndex) => (
                              <Chip key={tagIndex} label={tag} size="small" />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {content.memory_context && content.memory_context.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Memory Context Used:
                          </Typography>
                          {content.memory_context.map((context, contextIndex) => (
                            <Typography key={contextIndex} variant="body2" color="text.secondary">
                              • {context}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>

                    <CardActions>
                      <Button
                        startIcon={<CopyIcon />}
                        onClick={() => copyToClipboard(content.content)}
                      >
                        Copy
                      </Button>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(content)}
                      >
                        Edit
                      </Button>
                      <Button
                        startIcon={<SendIcon />}
                        onClick={() => navigate(`/events/${eventId}/post`)}
                      >
                        Post Now
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Content</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={8}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={saveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenerateContent;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Switch,
  FormHelperText
} from '@mui/material';
import {
  Send as SendIcon,
  Refresh as RefreshIcon,
  SmartToy as SmartToyIcon,
  Schedule as ScheduleIcon,
  Preview as PreviewIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  AutoAwesome as AutoAwesomeIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Event } from '../types';

interface PostContent {
  content: string;
  platform: 'bluesky';
  characterCount: number;
  hashtags: string[];
  mentions: string[];
}

const SocialMediaPost: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [postContent, setPostContent] = useState<PostContent>({
    content: '',
    platform: 'bluesky',
    characterCount: 0,
    hashtags: [],
    mentions: []
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true);
  const [tone, setTone] = useState('professional');
  const [copied, setCopied] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      // Mock event data for demonstration
      const mockEvent: Event = {
        id: eventId,
        title: 'Flutter Mobile Development Workshop',
        description: 'Learn Flutter development from basics to advanced concepts. Build your first mobile app with hands-on coding sessions.',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Tech Hub Providence',
        eventType: 'workshop',
        status: 'published',
        createdBy: user?.uid || 'user',
        chapterId: 'gdg-providence'
      };

      setEvent(mockEvent);
      
      // Auto-generate content if AI is enabled
      if (useAI) {
        generateAIContent(mockEvent);
      }
    } catch (err) {
      setError('Failed to fetch event details');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async (eventData?: Event) => {
    const targetEvent = eventData || event;
    if (!targetEvent) return;

    setLoading(true);
    try {
      // Mock AI content generation
      const aiContent = `🚀 Exciting news! Join us for "${targetEvent.title}"

${targetEvent.description}

📅 ${new Date(targetEvent.startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
⏰ ${new Date(targetEvent.startDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}
📍 ${targetEvent.location}

Perfect for developers wanting to enhance their mobile development skills! 🔥

#Flutter #MobileDev #GDG #Workshop #TechEvent #Learning #Community`;

      setGeneratedContent(aiContent);
      setPostContent(prev => ({
        ...prev,
        content: aiContent,
        characterCount: aiContent.length,
        hashtags: ['Flutter', 'MobileDev', 'GDG', 'Workshop', 'TechEvent', 'Learning', 'Community']
      }));

    } catch (err) {
      setError('Failed to generate AI content');
      console.error('Error generating content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (content: string) => {
    setPostContent(prev => ({
      ...prev,
      content,
      characterCount: content.length
    }));
  };

  const handlePost = async () => {
    if (!postContent.content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setPosting(true);
    try {
      // Mock posting to social media
      console.log('Posting to Bluesky:', {
        content: postContent.content,
        platform: postContent.platform,
        eventId: eventId,
        scheduled: isScheduled ? scheduledTime : null
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess(isScheduled ? 
        'Post scheduled successfully!' : 
        'Posted to Bluesky successfully!'
      );

      // Clear content after successful post
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 2000);

    } catch (err) {
      setError('Failed to post to social media');
      console.error('Error posting:', err);
    } finally {
      setPosting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postContent.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCharacterLimitColor = () => {
    const limit = 300; // Bluesky character limit
    const ratio = postContent.characterCount / limit;
    
    if (ratio < 0.8) return 'success';
    if (ratio < 0.95) return 'warning';
    return 'error';
  };

  const isOverLimit = postContent.characterCount > 300;

  if (loading && !event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SendIcon color="primary" />
          Social Media Post
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create and publish engaging social media content for "{event.title}"
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
      >
        <Alert severity="info">
          Content copied to clipboard!
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Event Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon />
                Event Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="body2">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                      {new Date(event.startDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(event.endDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2">{event.location}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <GroupIcon fontSize="small" />
                    <Typography variant="body2">{event.eventType}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Content Generation Options */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon />
                AI Content Options
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={useAI} 
                        onChange={(e) => setUseAI(e.target.checked)}
                      />
                    }
                    label="Use AI Content Generation"
                  />
                </Grid>
                
                {useAI && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
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
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        startIcon={loading ? <CircularProgress size={20} /> : <SmartToyIcon />}
                        onClick={() => generateAIContent()}
                        disabled={loading}
                        variant="outlined"
                      >
                        {loading ? 'Generating...' : 'Regenerate AI Content'}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Post Content Editor */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: '#00D4FF', width: 32, height: 32 }}>B</Avatar>
                  Bluesky Post
                </Typography>
                <Box display="flex" gap={1}>
                  <Tooltip title="Copy to clipboard">
                    <IconButton onClick={copyToClipboard}>
                      {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={8}
                value={postContent.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your social media post here..."
                sx={{ mb: 2 }}
              />

              <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                <Typography 
                  variant="body2" 
                  color={getCharacterLimitColor()}
                >
                  {postContent.characterCount}/300 characters
                </Typography>
                {isOverLimit && (
                  <Typography variant="body2" color="error">
                    Post exceeds character limit
                  </Typography>
                )}
              </Box>

              {postContent.hashtags.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Hashtags:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {postContent.hashtags.map((tag) => (
                      <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Scheduling Options */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                Post Scheduling
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={isScheduled} 
                        onChange={(e) => setIsScheduled(e.target.checked)}
                      />
                    }
                    label="Schedule for later"
                  />
                </Grid>
                
                {isScheduled && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      label="Schedule Time"
                      size="small"
                    />
                  </Grid>
                )}
              </Grid>
              
              {isScheduled && scheduledTime && (
                <FormHelperText>
                  Post will be published on {new Date(scheduledTime).toLocaleString()}
                </FormHelperText>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} justifyContent="end">
            <Button
              variant="outlined"
              onClick={() => navigate(`/events/${eventId}`)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={posting ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={handlePost}
              disabled={posting || !postContent.content.trim() || isOverLimit}
            >
              {posting ? (isScheduled ? 'Scheduling...' : 'Posting...') : (isScheduled ? 'Schedule Post' : 'Post Now')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SocialMediaPost;
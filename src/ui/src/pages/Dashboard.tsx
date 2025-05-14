import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Event as EventIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  PostAdd as PostAddIcon,
  Message as MessageIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
  AddCircleOutline as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Event, SocialPost } from '../types';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in a real implementation, this would be fetched from the API
  const upcomingEvents: Event[] = [
    {
      id: '1',
      title: 'Flutter Workshop: Building Beautiful UIs',
      date: '2025-06-15',
      time: '18:00',
      description: 'Learn how to build beautiful user interfaces with Flutter.',
      type: 'workshop',
      location: 'Tech Hub Downtown',
      created_by: 'user1',
      created_at: '2025-05-01T12:00:00Z',
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Firebase & Google Cloud Study Jam',
      date: '2025-06-22',
      time: '19:00',
      description: 'Hands-on workshop with Firebase and Google Cloud Platform.',
      type: 'meetup',
      location: 'Virtual',
      created_by: 'user1',
      created_at: '2025-05-03T10:30:00Z',
      status: 'scheduled',
    },
  ];

  const recentPosts: SocialPost[] = [
    {
      id: '1',
      text: '🚀 Join us for our upcoming Flutter Workshop on June 15th! Learn from expert developers and build your first Flutter app. Register now at gdg.community.dev/events/123',
      platform: 'twitter',
      event_id: '1',
      created_by: 'user1',
      created_at: '2025-05-10T14:32:00Z',
      status: 'published',
      published_at: '2025-05-10T14:32:00Z',
      performance_metrics: {
        engagement_rate: 4.2,
        likes: 18,
        shares: 7,
      },
    },
    {
      id: '2',
      text: 'Excited to announce our next event: Firebase & Google Cloud Study Jam on June 22nd! We\'ll cover Firebase essentials and GCP fundamentals. Perfect for beginners and intermediate developers alike. #GDG #Firebase #GoogleCloud',
      platform: 'linkedin',
      event_id: '2',
      created_by: 'user2',
      created_at: '2025-05-12T10:15:00Z',
      status: 'scheduled',
      scheduled_for: '2025-05-16T12:00:00Z',
    },
  ];

  const refreshData = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const generatePostForEvent = (eventId: string) => {
    navigate(`/content/create?eventId=${eventId}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="500">
          Dashboard
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/create')}
            sx={{ mr: 2 }}
          >
            New Event
          </Button>
          <IconButton onClick={refreshData} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
                elevation={0}
                variant="outlined"
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    2
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Events
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(66, 133, 244, 0.1)',
                    color: theme.palette.primary.main,
                  }}
                >
                  <EventIcon />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
                elevation={0}
                variant="outlined"
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts This Month
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(234, 67, 53, 0.1)',
                    color: theme.palette.secondary.main,
                  }}
                >
                  <MessageIcon />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
                elevation={0}
                variant="outlined"
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    4.2%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Engagement
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(251, 188, 5, 0.1)',
                    color: theme.palette.warning.main,
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
                elevation={0}
                variant="outlined"
              >
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Approvals
                  </Typography>
                </Box>
                <Badge badgeContent={1} color="error">
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(52, 168, 83, 0.1)',
                      color: theme.palette.success.main,
                    }}
                  >
                    <PostAddIcon />
                  </Avatar>
                </Badge>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}
            elevation={0}
            variant="outlined"
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Upcoming Events</Typography>
              <Button
                size="small"
                endIcon={<AddIcon />}
                onClick={() => navigate('/calendar')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flexGrow: 1 }}>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    variant="outlined"
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box>
                          <Typography variant="h6">{event.title}</Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                              color: 'text.secondary',
                            }}
                          >
                            <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              at {event.time}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              size="small"
                              label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              size="small"
                              label={event.location}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/events/edit/${event.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<MessageIcon />}
                        onClick={() => generatePostForEvent(event.id)}
                      >
                        Generate Post
                      </Button>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <EventIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No upcoming events
                  </Typography>
                  <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/events/create')}
                  >
                    Create Event
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Posts */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}
            elevation={0}
            variant="outlined"
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Recent Posts</Typography>
              <Button
                size="small"
                endIcon={<AddIcon />}
                onClick={() => navigate('/content')}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ flexGrow: 1 }}>
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Card key={post.id} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Chip
                              size="small"
                              label={post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                              color={post.platform === 'twitter' ? 'primary' : post.platform === 'linkedin' ? 'secondary' : 'default'}
                              sx={{ mb: 1 }}
                            />
                            <Chip
                              size="small"
                              label={post.status}
                              variant="outlined"
                              color={post.status === 'published' ? 'success' : post.status === 'scheduled' ? 'warning' : 'default'}
                            />
                          </Box>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {post.text.length > 120
                              ? `${post.text.substring(0, 120)}...`
                              : post.text}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            {post.status === 'scheduled' ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="caption">
                                  Scheduled for{' '}
                                  {post.scheduled_for
                                    ? new Date(post.scheduled_for).toLocaleString()
                                    : 'N/A'}
                                </Typography>
                              </Box>
                            ) : (
                              post.performance_metrics && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Chip
                                    size="small"
                                    icon={<TrendingUpIcon fontSize="small" />}
                                    label={`${post.performance_metrics.engagement_rate}% Engagement`}
                                    color="success"
                                    variant="outlined"
                                  />
                                </Box>
                              )
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/content/edit/${post.id}`)}
                      >
                        Edit
                      </Button>
                      {post.status === 'published' && post.platform === 'twitter' && (
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<TrendingUpIcon />}
                          onClick={() => navigate(`/analytics/post/${post.id}`)}
                        >
                          View Performance
                        </Button>
                      )}
                      {post.status === 'scheduled' && (
                        <Button
                          size="small"
                          color="primary"
                          startIcon={<ScheduleIcon />}
                          onClick={() => navigate(`/calendar?date=${post.scheduled_for?.split('T')[0]}`)}
                        >
                          View on Calendar
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <MessageIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No recent posts
                  </Typography>
                  <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/content/create')}
                  >
                    Create Post
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
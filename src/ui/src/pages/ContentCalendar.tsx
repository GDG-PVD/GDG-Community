import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AddCircleOutline as AddIcon,
  Schedule as ScheduleIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Mock data
const mockEvents = [
  {
    id: 'e1',
    title: 'Flutter Workshop',
    date: '2025-06-15',
    time: '18:00',
    type: 'workshop',
  },
  {
    id: 'e2',
    title: 'Firebase Study Jam',
    date: '2025-06-22',
    time: '19:00',
    type: 'meetup',
  }
];

const mockPosts = [
  {
    id: 'p1',
    text: 'Join us for Flutter Workshop',
    platform: 'twitter',
    date: '2025-06-10',
    time: '12:00',
    status: 'scheduled',
  },
  {
    id: 'p2',
    text: 'Learn Firebase with us',
    platform: 'linkedin',
    date: '2025-06-15',
    time: '14:00',
    status: 'scheduled',
  },
  {
    id: 'p3',
    text: 'Recap of our latest event',
    platform: 'facebook',
    date: '2025-06-05',
    time: '15:30',
    status: 'scheduled',
  }
];

const ContentCalendar: React.FC = () => {
  const theme = useTheme();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Check if a day has events or posts
  const getDayContent = (day: Date | null) => {
    if (!day) return { events: [], posts: [] };
    
    const dateString = day.toISOString().split('T')[0];
    
    const events = mockEvents.filter(event => event.date === dateString);
    const posts = mockPosts.filter(post => post.date === dateString);
    
    return { events, posts };
  };

  // Render platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />;
      case 'linkedin':
        return <LinkedInIcon fontSize="small" sx={{ color: '#0077B5' }} />;
      case 'facebook':
        return <FacebookIcon fontSize="small" sx={{ color: '#4267B2' }} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="500">
          Content Calendar
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Navigate to content creation */}}
            sx={{ mr: 2 }}
          >
            Schedule Post
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Calendar Navigation */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={goToPreviousMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              {monthName}
            </Typography>
            <IconButton onClick={goToNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Button variant="outlined" onClick={goToToday}>
            Today
          </Button>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 2, borderRadius: 2 }} elevation={0} variant="outlined">
          {/* Day headers */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="subtitle2">{day}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          {/* Calendar grid */}
          <Grid container spacing={1}>
            {days.map((day, index) => {
              const { events, posts } = getDayContent(day);
              const isToday = day && new Date().toDateString() === day.toDateString();
              
              return (
                <Grid item xs key={index}>
                  <Paper
                    elevation={0}
                    variant={isToday ? "elevation" : "outlined"}
                    sx={{
                      height: 120,
                      p: 1,
                      overflow: 'auto',
                      bgcolor: isToday ? 'primary.light' : 'background.paper',
                      border: isToday ? `1px solid ${theme.palette.primary.main}` : undefined,
                    }}
                  >
                    {day && (
                      <>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: isToday ? 'bold' : 'regular',
                            color: isToday ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {day.getDate()}
                        </Typography>
                        
                        <Box sx={{ mt: 1 }}>
                          {events.map((event) => (
                            <Box
                              key={event.id}
                              sx={{
                                bgcolor: 'info.light',
                                color: 'info.contrastText',
                                p: 0.5,
                                borderRadius: 1,
                                mb: 0.5,
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {event.title}
                            </Box>
                          ))}
                          
                          {posts.map((post) => (
                            <Box
                              key={post.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: 'grey.100',
                                p: 0.5,
                                borderRadius: 1,
                                mb: 0.5,
                                fontSize: '0.75rem',
                              }}
                            >
                              {getPlatformIcon(post.platform)}
                              <Box
                                component="span"
                                sx={{
                                  ml: 0.5,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {post.time}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      {/* Upcoming Schedule */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Upcoming Posts
        </Typography>
        <Grid container spacing={3}>
          {mockPosts.map((post) => (
            <Grid item xs={12} md={4} key={post.id}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getPlatformIcon(post.platform)}
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {post.text}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(`${post.date}T${post.time}`).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ContentCalendar;
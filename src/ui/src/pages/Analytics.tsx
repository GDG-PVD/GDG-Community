import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Alert,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';

// Mock data
const engagementData = [
  { month: 'Jan', twitter: 4.2, linkedin: 3.1, facebook: 2.0 },
  { month: 'Feb', twitter: 3.8, linkedin: 3.3, facebook: 2.2 },
  { month: 'Mar', twitter: 4.5, linkedin: 3.8, facebook: 2.5 },
  { month: 'Apr', twitter: 4.0, linkedin: 4.0, facebook: 2.3 },
  { month: 'May', twitter: 4.8, linkedin: 4.2, facebook: 2.7 },
  { month: 'Jun', twitter: 5.2, linkedin: 4.6, facebook: 3.0 },
];

const topPosts = [
  { id: 1, platform: 'twitter', content: 'Join us for Flutter Workshop!', engagement: 6.8 },
  { id: 2, platform: 'linkedin', content: 'Exciting news about our next Firebase event', engagement: 5.3 },
  { id: 3, platform: 'twitter', content: 'Recap of our successful Developer meetup', engagement: 4.9 },
];

const contentTypeData = [
  { name: 'Event Announcements', value: 45 },
  { name: 'Workshop Content', value: 25 },
  { name: 'Community News', value: 15 },
  { name: 'General Updates', value: 15 },
];

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

const Analytics: React.FC = () => {
  const { userProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('6m');
  const [platformFilter, setPlatformFilter] = useState('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handlePlatformChange = (event: SelectChangeEvent) => {
    setPlatformFilter(event.target.value);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="500">
          Analytics
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <FormControl size="small" sx={{ width: 120, mr: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select value={timeRange} label="Time Range" onChange={handleTimeRangeChange}>
              <MenuItem value="1m">Last Month</MenuItem>
              <MenuItem value="3m">Last 3 Months</MenuItem>
              <MenuItem value="6m">Last 6 Months</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: 120 }}>
            <InputLabel>Platform</InputLabel>
            <Select value={platformFilter} label="Platform" onChange={handlePlatformChange}>
              <MenuItem value="all">All Platforms</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="facebook">Facebook</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Paper sx={{ mb: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Engagement" />
          <Tab label="Content Performance" />
          <Tab label="Audience" />
        </Tabs>
      </Paper>

      {/* Content for Tab 0 - Engagement */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Overall Engagement Metrics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Engagement Over Time
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Average engagement rates across platforms
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Engagement Rate']} />
                  <Legend />
                  <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" activeDot={{ r: 8 }} name="Twitter" />
                  <Line type="monotone" dataKey="linkedin" stroke="#0077B5" name="LinkedIn" />
                  <Line type="monotone" dataKey="facebook" stroke="#4267B2" name="Facebook" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Top Performing Posts */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={0} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Top Performing Posts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Posts with highest engagement rates
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {topPosts.map((post) => (
                <Box key={post.id} sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                      <Typography variant="subtitle2">
                        {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                      </Typography>
                      <Typography variant="body2">{post.content}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Typography variant="h6" color="primary">
                        {post.engagement.toFixed(1)}%
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Content Type Distribution */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={0} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Content Type Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Breakdown of content by type
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Content for Tab 1 - Content Performance */}
      {tabValue === 1 && (
        <Box>
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small">
                View Details
              </Button>
            }
          >
            Workshop announcements are your best performing content type with 5.2% average engagement.
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Performance by Content Type
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Comparing engagement across different content categories
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={[
                      { name: 'Event Announcements', twitter: 4.8, linkedin: 5.2, facebook: 3.1 },
                      { name: 'Workshops', twitter: 5.3, linkedin: 4.9, facebook: 3.5 },
                      { name: 'Community News', twitter: 4.2, linkedin: 3.7, facebook: 2.8 },
                      { name: 'General Updates', twitter: 3.5, linkedin: 3.2, facebook: 2.2 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Engagement Rate']} />
                    <Legend />
                    <Bar dataKey="twitter" name="Twitter" fill="#1DA1F2" />
                    <Bar dataKey="linkedin" name="LinkedIn" fill="#0077B5" />
                    <Bar dataKey="facebook" name="Facebook" fill="#4267B2" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Content for Tab 2 - Audience */}
      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Coming Soon: Audience Analytics
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
            <Typography variant="body1">
              Audience demographics and insights will be available in a future update.
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Analytics;
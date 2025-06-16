import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  Memory as MemoryIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  EmojiObjects as InsightIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  AccessTime as RecentIcon,
  Category as CategoryIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface MemoryItem {
  id: string;
  type: 'episodic' | 'semantic' | 'reflection';
  content: string;
  timestamp: string;
  relevance: number;
  tags: string[];
  source?: string;
  associations?: string[];
}

interface MemoryStats {
  total: number;
  episodic: number;
  semantic: number;
  reflection: number;
  growth: number;
  quality: number;
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
      id={`memory-tabpanel-${index}`}
      aria-labelledby={`memory-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MemoryDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [stats, setStats] = useState<MemoryStats>({
    total: 0,
    episodic: 0,
    semantic: 0,
    reflection: 0,
    growth: 0,
    quality: 0
  });
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    setLoading(true);
    try {
      // Mock memory data for demonstration
      const mockMemories: MemoryItem[] = [
        {
          id: '1',
          type: 'episodic',
          content: 'User asked about Flutter state management. Provided comprehensive explanation with code examples.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          relevance: 0.95,
          tags: ['flutter', 'state-management', 'help'],
          source: 'chat_session_001',
          associations: ['flutter_patterns', 'user_preferences']
        },
        {
          id: '2',
          type: 'semantic',
          content: 'Flutter Provider pattern: Effective state management solution for medium to large applications.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          relevance: 0.88,
          tags: ['flutter', 'provider', 'architecture'],
          associations: ['state_management', 'best_practices']
        },
        {
          id: '3',
          type: 'reflection',
          content: 'Analysis: Users prefer step-by-step explanations with practical examples. Engagement increases 40% with code snippets.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          relevance: 0.92,
          tags: ['analysis', 'user-preferences', 'improvement'],
          source: 'reflection_agent',
          associations: ['teaching_methods', 'engagement_patterns']
        },
        {
          id: '4',
          type: 'episodic',
          content: 'Helped organize GDG Providence Flutter workshop. Recommended agenda structure and speaker guidelines.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          relevance: 0.85,
          tags: ['gdg-providence', 'workshop', 'organizing'],
          source: 'event_planning_session',
          associations: ['event_templates', 'community_engagement']
        },
        {
          id: '5',
          type: 'semantic',
          content: 'Event promotion best practice: LinkedIn posts with learning outcomes see 60% higher engagement.',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          relevance: 0.78,
          tags: ['linkedin', 'promotion', 'engagement'],
          associations: ['social_media_patterns', 'event_marketing']
        }
      ];

      setMemories(mockMemories);

      // Calculate stats
      const episodicCount = mockMemories.filter(m => m.type === 'episodic').length;
      const semanticCount = mockMemories.filter(m => m.type === 'semantic').length;
      const reflectionCount = mockMemories.filter(m => m.type === 'reflection').length;

      setStats({
        total: mockMemories.length,
        episodic: episodicCount,
        semantic: semanticCount,
        reflection: reflectionCount,
        growth: 15, // Mock growth percentage
        quality: 0.87 // Mock average quality score
      });

    } catch (err) {
      setError('Failed to load memory data');
      console.error('Error loading memory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type) {
      case 'episodic': return theme.palette.primary.main;
      case 'semantic': return theme.palette.success.main;
      case 'reflection': return theme.palette.secondary.main;
      default: return theme.palette.grey[500];
    }
  };

  const getMemoryTypeIcon = (type: string) => {
    switch (type) {
      case 'episodic': return <TimelineIcon />;
      case 'semantic': return <CategoryIcon />;
      case 'reflection': return <PsychologyIcon />;
      default: return <MemoryIcon />;
    }
  };

  const handleViewMemory = (memory: MemoryItem) => {
    setSelectedMemory(memory);
    setViewDialogOpen(true);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Chart data for memory growth
  const memoryGrowthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Episodic Memories',
        data: [5, 12, 19, stats.episodic],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '20',
        tension: 0.4
      },
      {
        label: 'Semantic Memories',
        data: [2, 5, 8, stats.semantic],
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.main + '20',
        tension: 0.4
      },
      {
        label: 'Reflections',
        data: [1, 2, 4, stats.reflection],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main + '20',
        tension: 0.4
      }
    ]
  };

  // Chart data for memory distribution
  const memoryDistributionData = {
    labels: ['Episodic', 'Semantic', 'Reflection'],
    datasets: [{
      data: [stats.episodic, stats.semantic, stats.reflection],
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.success.main,
        theme.palette.secondary.main
      ],
      borderWidth: 2,
      borderColor: theme.palette.background.paper
    }]
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MemoryIcon color="primary" />
          Memory Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor and analyze agent memory and learning patterns
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MemoryIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="primary">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Memories
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="success.main">
                    +{stats.growth}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Growth This Week
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AutoAwesomeIcon color="secondary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="secondary.main">
                    {Math.round(stats.quality * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quality Score
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PsychologyIcon color="info" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {stats.reflection}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reflections
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab 
            label="Recent Memories" 
            icon={<RecentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Analytics" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Insights" 
            icon={<LightbulbIcon />} 
            iconPosition="start"
          />
        </Tabs>

        {/* Recent Memories Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Typography variant="h6">Recent Memory Activity</Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadMemoryData}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          <List>
            {memories.map((memory) => (
              <Paper key={memory.id} sx={{ mb: 2 }}>
                <ListItem>
                  <ListItemIcon sx={{ color: getMemoryTypeColor(memory.type) }}>
                    {getMemoryTypeIcon(memory.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1">
                          {memory.content.substring(0, 80)}
                          {memory.content.length > 80 ? '...' : ''}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={memory.type}
                          sx={{ 
                            bgcolor: getMemoryTypeColor(memory.type),
                            color: 'white'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {formatTimeAgo(memory.timestamp)} • Relevance: {Math.round(memory.relevance * 100)}%
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          {memory.tags.slice(0, 3).map((tag) => (
                            <Chip key={tag} size="small" label={tag} variant="outlined" />
                          ))}
                          {memory.tags.length > 3 && (
                            <Chip size="small" label={`+${memory.tags.length - 3} more`} variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <IconButton onClick={() => handleViewMemory(memory)}>
                    <VisibilityIcon />
                  </IconButton>
                </ListItem>
              </Paper>
            ))}
          </List>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Memory Growth Over Time
                </Typography>
                <Box height={300}>
                  {/* Chart would be rendered here with actual Chart.js integration */}
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    height="100%" 
                    bgcolor="grey.50"
                    borderRadius={1}
                  >
                    <Typography color="text.secondary">
                      Memory Growth Chart (Chart.js integration required)
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Memory Distribution
                </Typography>
                <Box height={300}>
                  {/* Doughnut chart would be rendered here */}
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center" 
                    height="100%" 
                    bgcolor="grey.50"
                    borderRadius={1}
                  >
                    <Typography color="text.secondary">
                      Distribution Chart
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Memory Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="primary">
                        {((stats.episodic / stats.total) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Episodic Memory Ratio
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="success.main">
                        {memories.filter(m => m.relevance > 0.8).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        High-Relevance Memories
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="secondary.main">
                        {new Set(memories.flatMap(m => m.tags)).size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Unique Tags
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Insights Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InsightIcon />
            Memory-Driven Insights
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Learning Patterns
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Users prefer step-by-step explanations with code examples
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Flutter-related queries show highest engagement
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Event planning assistance most requested during weekday mornings
                  </Typography>
                  <Chip label="Based on episodic memory analysis" size="small" color="primary" />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    Optimization Opportunities
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Increase technical depth in Flutter explanations
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Add more visual examples to event planning guides
                  </Typography>
                  <Typography variant="body2" paragraph>
                    • Improve follow-up question suggestions
                  </Typography>
                  <Chip label="From reflection analysis" size="small" color="success" />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary.main">
                    Knowledge Gaps Identified
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Technical Topics
                      </Typography>
                      <Typography variant="body2">
                        • Advanced Flutter animations
                        • Firebase security rules
                        • CI/CD best practices
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Community Management
                      </Typography>
                      <Typography variant="body2">
                        • Sponsor outreach templates
                        • Virtual event best practices
                        • Member retention strategies
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" gutterBottom>
                        Process Improvements
                      </Typography>
                      <Typography variant="body2">
                        • Automated reminder systems
                        • Feedback collection workflows
                        • Post-event follow-up processes
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Memory Detail Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {selectedMemory && getMemoryTypeIcon(selectedMemory.type)}
          Memory Details
          {selectedMemory && (
            <Chip 
              label={selectedMemory.type}
              size="small"
              sx={{ 
                bgcolor: getMemoryTypeColor(selectedMemory.type),
                color: 'white'
              }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedMemory && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Content
              </Typography>
              <Typography variant="body1" paragraph sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                {selectedMemory.content}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Metadata
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Timestamp: {new Date(selectedMemory.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Relevance: {Math.round(selectedMemory.relevance * 100)}%
                  </Typography>
                </Grid>
                {selectedMemory.source && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Source: {selectedMemory.source}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {selectedMemory.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
              
              {selectedMemory.associations && selectedMemory.associations.length > 0 && (
                <Box mt={2}>
                  <Typography variant="h6" gutterBottom>
                    Associations
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedMemory.associations.map((assoc) => (
                      <Chip key={assoc} label={assoc} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MemoryDashboard;
import React, { useState, useEffect, useContext } from 'react';
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
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Tooltip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Description as DocumentIcon,
  Folder as FolderIcon,
  Tag as TagIcon,
  Memory as MemoryIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  AutoAwesome as AutoAwesomeIcon,
  School as SchoolIcon,
  EmojiObjects as IdeaIcon,
  AccountTree as TreeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface KnowledgeItem {
  id: string;
  type: 'document' | 'memory' | 'insight' | 'learning';
  title: string;
  content: string;
  metadata: {
    source?: string;
    timestamp?: string;
    tags?: string[];
    category?: string;
    relevance?: number;
    layer?: 'semantic' | 'kinetic' | 'dynamic';
  };
}

interface KnowledgeCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  expanded: boolean;
  items: KnowledgeItem[];
}

const KnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<KnowledgeItem[]>([]);
  const [filterLayer, setFilterLayer] = useState<string>('all');
  const [categories, setCategories] = useState<KnowledgeCategory[]>([
    {
      name: 'Event Templates',
      icon: <DocumentIcon />,
      count: 0,
      color: '#4CAF50',
      expanded: true,
      items: []
    },
    {
      name: 'Community Guidelines',
      icon: <SchoolIcon />,
      count: 0,
      color: '#2196F3',
      expanded: false,
      items: []
    },
    {
      name: 'Workflows & Processes',
      icon: <TreeIcon />,
      count: 0,
      color: '#FF9800',
      expanded: false,
      items: []
    },
    {
      name: 'Learned Patterns',
      icon: <PsychologyIcon />,
      count: 0,
      color: '#9C27B0',
      expanded: false,
      items: []
    },
    {
      name: 'Agent Memories',
      icon: <MemoryIcon />,
      count: 0,
      color: '#607D8B',
      expanded: false,
      items: []
    }
  ]);

  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  const loadKnowledgeBase = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockData: KnowledgeItem[] = [
        {
          id: '1',
          type: 'document',
          title: 'Flutter Workshop Event Template',
          content: 'Comprehensive template for organizing Flutter workshops including agenda, prerequisites, and follow-up materials.',
          metadata: {
            layer: 'semantic',
            category: 'template',
            tags: ['flutter', 'workshop', 'template'],
            timestamp: new Date().toISOString(),
            relevance: 0.95
          }
        },
        {
          id: '2',
          type: 'document',
          title: 'GDG Brand Guidelines',
          content: 'Official brand guidelines for GDG community events and communications.',
          metadata: {
            layer: 'semantic',
            category: 'guideline',
            tags: ['branding', 'guidelines', 'community'],
            timestamp: new Date().toISOString(),
            relevance: 0.90
          }
        },
        {
          id: '3',
          type: 'insight',
          title: 'Event Planning Workflow',
          content: '6-step comprehensive process from event concept to post-event follow-up.',
          metadata: {
            layer: 'kinetic',
            category: 'workflow',
            tags: ['planning', 'process', 'events'],
            timestamp: new Date().toISOString(),
            relevance: 0.88
          }
        },
        {
          id: '4',
          type: 'learning',
          title: 'Optimal LinkedIn Posting Times',
          content: 'Analysis shows 9-11 AM and 2-4 PM EST achieve 75% higher engagement for tech community posts.',
          metadata: {
            layer: 'dynamic',
            category: 'pattern',
            tags: ['linkedin', 'timing', 'engagement'],
            timestamp: new Date().toISOString(),
            relevance: 0.75
          }
        },
        {
          id: '5',
          type: 'memory',
          title: 'Recent Event Success Factors',
          content: 'Events with detailed learning outcomes in announcements see 40% higher registration rates.',
          metadata: {
            layer: 'dynamic',
            category: 'memory',
            tags: ['events', 'registration', 'success'],
            timestamp: new Date().toISOString(),
            relevance: 0.82
          }
        }
      ];

      // Organize data into categories
      const updatedCategories = categories.map(category => {
        let categoryItems: KnowledgeItem[] = [];
        
        switch (category.name) {
          case 'Event Templates':
            categoryItems = mockData.filter(item => 
              item.metadata.category === 'template'
            );
            break;
          case 'Community Guidelines':
            categoryItems = mockData.filter(item => 
              item.metadata.category === 'guideline'
            );
            break;
          case 'Workflows & Processes':
            categoryItems = mockData.filter(item => 
              item.metadata.category === 'workflow'
            );
            break;
          case 'Learned Patterns':
            categoryItems = mockData.filter(item => 
              item.metadata.category === 'pattern'
            );
            break;
          case 'Agent Memories':
            categoryItems = mockData.filter(item => 
              item.metadata.category === 'memory'
            );
            break;
        }
        
        return {
          ...category,
          count: categoryItems.length,
          items: categoryItems
        };
      });

      setCategories(updatedCategories);
    } catch (err) {
      setError('Failed to load knowledge base');
      console.error('Error loading knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      // Mock search functionality
      const allItems = categories.flatMap(cat => cat.items);
      const results = allItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.metadata.tags?.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      // Apply layer filter
      const filteredResults = filterLayer === 'all' 
        ? results 
        : results.filter(item => item.metadata.layer === filterLayer);

      setSearchResults(filteredResults);
      setSelectedTab(1); // Switch to search results tab
    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setCategories(prev => prev.map(cat => 
      cat.name === categoryName 
        ? { ...cat, expanded: !cat.expanded }
        : cat
    ));
  };

  const getLayerColor = (layer?: string) => {
    switch (layer) {
      case 'semantic': return '#4CAF50';
      case 'kinetic': return '#FF9800';
      case 'dynamic': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getLayerIcon = (layer?: string) => {
    switch (layer) {
      case 'semantic': return <DocumentIcon />;
      case 'kinetic': return <TreeIcon />;
      case 'dynamic': return <PsychologyIcon />;
      default: return <FolderIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          Knowledge Base
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse and search the three-layer knowledge architecture
        </Typography>
      </Box>

      {/* Search Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Layer</InputLabel>
              <Select
                value={filterLayer}
                label="Filter by Layer"
                onChange={(e) => setFilterLayer(e.target.value)}
              >
                <MenuItem value="all">All Layers</MenuItem>
                <MenuItem value="semantic">
                  <Box display="flex" alignItems="center" gap={1}>
                    <DocumentIcon sx={{ color: '#4CAF50' }} />
                    Semantic (Static)
                  </Box>
                </MenuItem>
                <MenuItem value="kinetic">
                  <Box display="flex" alignItems="center" gap={1}>
                    <TreeIcon sx={{ color: '#FF9800' }} />
                    Kinetic (Process)
                  </Box>
                </MenuItem>
                <MenuItem value="dynamic">
                  <Box display="flex" alignItems="center" gap={1}>
                    <PsychologyIcon sx={{ color: '#9C27B0' }} />
                    Dynamic (Learning)
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={searching ? <CircularProgress size={20} /> : <SearchIcon />}
              onClick={performSearch}
              disabled={searching || !searchQuery.trim()}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Navigation Tabs */}
        <Grid item xs={12}>
          <Paper>
            <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
              <Tab 
                label="Browse Categories" 
                icon={<FolderIcon />} 
                iconPosition="start"
              />
              <Tab 
                label={`Search Results (${searchResults.length})`}
                icon={<SearchIcon />} 
                iconPosition="start"
              />
              <Tab 
                label="Knowledge Insights" 
                icon={<IdeaIcon />} 
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Grid>

        {/* Tab Content */}
        <Grid item xs={12}>
          {selectedTab === 0 && (
            <Grid container spacing={2}>
              {categories.map((category) => (
                <Grid item xs={12} md={6} key={category.name}>
                  <Card>
                    <ListItem 
                      button 
                      onClick={() => toggleCategory(category.name)}
                      sx={{ borderLeft: `4px solid ${category.color}` }}
                    >
                      <ListItemIcon sx={{ color: category.color }}>
                        {category.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.name}
                        secondary={`${category.count} items`}
                      />
                      <Badge badgeContent={category.count} color="primary">
                        {category.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </Badge>
                    </ListItem>
                    <Collapse in={category.expanded}>
                      <Divider />
                      <List sx={{ pl: 2 }}>
                        {category.items.map((item) => (
                          <ListItem key={item.id}>
                            <ListItemIcon>
                              {getLayerIcon(item.metadata.layer)}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.content.substring(0, 100)}...
                                  </Typography>
                                  <Box display="flex" gap={1} mt={1}>
                                    <Chip
                                      size="small"
                                      label={item.metadata.layer}
                                      sx={{ bgcolor: getLayerColor(item.metadata.layer), color: 'white' }}
                                    />
                                    {item.metadata.tags?.slice(0, 2).map((tag) => (
                                      <Chip key={tag} size="small" label={tag} variant="outlined" />
                                    ))}
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                        {category.items.length === 0 && (
                          <ListItem>
                            <ListItemText 
                              primary="No items yet"
                              secondary="Items will appear here as the knowledge base grows"
                            />
                          </ListItem>
                        )}
                      </List>
                    </Collapse>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {selectedTab === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Search Results ({searchResults.length})
              </Typography>
              {searchResults.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    {searchQuery ? 'No results found' : 'Enter a search query'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'Try different keywords or check the layer filter' : 'Search across templates, workflows, and learned patterns'}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {searchResults.map((item) => (
                    <Grid item xs={12} key={item.id}>
                      <Card>
                        <CardContent>
                          <Box display="flex" alignItems="start" gap={2}>
                            <Box sx={{ color: getLayerColor(item.metadata.layer) }}>
                              {getLayerIcon(item.metadata.layer)}
                            </Box>
                            <Box flex={1}>
                              <Typography variant="h6" gutterBottom>
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {item.content}
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip
                                  size="small"
                                  label={item.metadata.layer}
                                  sx={{ bgcolor: getLayerColor(item.metadata.layer), color: 'white' }}
                                />
                                {item.metadata.relevance && (
                                  <Chip
                                    size="small"
                                    label={`${Math.round(item.metadata.relevance * 100)}% relevant`}
                                    color="success"
                                    variant="outlined"
                                  />
                                )}
                                {item.metadata.tags?.map((tag) => (
                                  <Chip key={tag} size="small" label={tag} variant="outlined" />
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          )}

          {selectedTab === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IdeaIcon />
                Knowledge Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                      </Typography>
                      <Typography variant="h6">
                        Total Knowledge Items
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Across all three layers
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="success.main" gutterBottom>
                        85%
                      </Typography>
                      <Typography variant="h6">
                        Coverage Score
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Of common community scenarios
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="warning.main" gutterBottom>
                        3
                      </Typography>
                      <Typography variant="h6">
                        Active Layers
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Semantic, Kinetic, Dynamic
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default KnowledgeBase;
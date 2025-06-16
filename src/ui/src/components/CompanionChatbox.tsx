import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Drawer,
  useTheme,
  useMediaQuery,
  Fab,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Psychology as PsychologyIcon,
  Memory as MemoryIcon,
  AutoAwesome as AIIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing?: boolean;
  data?: any;
  context?: {
    intent?: string;
    confidence?: number;
    memoryUsed?: boolean;
    knowledgeUsed?: boolean;
  };
}

interface CompanionChatboxProps {
  open: boolean;
  onClose: () => void;
}

const CompanionChatbox: React.FC<CompanionChatboxProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: `Hi! I'm your GDG Community AI Companion. I can help you with:

• Event planning and organization
• Content creation for social media
• Community management advice
• Technical questions about development
• GDG best practices and guidelines

What would you like to help with today?`,
      sender: 'agent',
      timestamp: new Date(),
      context: {
        intent: 'welcome',
        confidence: 1.0,
        memoryUsed: false,
        knowledgeUsed: true
      }
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuth();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Add a placeholder for the agent's response
    const placeholderId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      {
        id: placeholderId,
        text: '',
        sender: 'agent',
        timestamp: new Date(),
        processing: true,
      },
    ]);

    try {
      // Simulate API call to agent
      // In a real implementation, you would call your agent API
      const response = await processAgentQuery(input);
      
      // Replace placeholder with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === placeholderId 
            ? {
                id: placeholderId,
                text: response.text,
                sender: 'agent',
                timestamp: new Date(),
                data: response.data,
                context: response.context,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Update placeholder with error message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === placeholderId 
            ? {
                id: placeholderId,
                text: 'Sorry, I encountered an error processing your request. Please try again.',
                sender: 'agent',
                timestamp: new Date(),
              }
            : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Process the user's query through the agent system
  const processAgentQuery = async (query: string): Promise<any> => {
    try {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const input = query.toLowerCase();
      
      // Enhanced intent detection and response generation
      if (input.includes('event') || input.includes('planning') || input.includes('organize')) {
        return {
          text: `I can help you plan your event! Here are some key steps:

1. **Define your goals** - What skills do you want attendees to learn?
2. **Choose a format** - Workshop, meetup, study jam, or hybrid event?
3. **Set a date** - Check the GDG calendar to avoid conflicts
4. **Find a venue** - Consider capacity, location, and tech requirements
5. **Create content** - Prepare agenda, materials, and promotional content

Would you like me to help you with any specific aspect of event planning?`,
          context: {
            intent: 'event_planning',
            confidence: 0.95,
            memoryUsed: false,
            knowledgeUsed: true
          }
        };
      }
      
      if (input.includes('content') || input.includes('post') || input.includes('social media')) {
        return {
          text: `I can help you create engaging social media content! Here's what I can do:

📝 **Content Generation**
• Event announcements and promotions
• Technical tips and tutorials
• Community highlights and success stories

🎯 **Platform Optimization**
• LinkedIn: Professional tone, industry insights
• Bluesky: Community-focused, conversational

🚀 **AI-Powered Features**
• Automatic hashtag suggestions
• Engagement optimization
• Content scheduling recommendations

Want me to generate content for a specific event or topic?`,
          context: {
            intent: 'content_creation',
            confidence: 0.92,
            memoryUsed: false,
            knowledgeUsed: true
          }
        };
      }
      
      if (input.includes('flutter') || input.includes('development') || input.includes('coding')) {
        return {
          text: `Great! I can help with Flutter development topics:

🛠️ **Getting Started**
• Setting up development environment
• Understanding widgets and state management
• Best practices for app architecture

📱 **Advanced Topics**
• Performance optimization
• Custom animations and UI
• Integration with Firebase and APIs

🎓 **Learning Resources**
• Official Flutter documentation
• Community-recommended tutorials
• Hands-on project ideas

What specific Flutter topic would you like to explore?`,
          context: {
            intent: 'technical_help',
            confidence: 0.88,
            memoryUsed: true,
            knowledgeUsed: true
          }
        };
      }

      if (input.includes('gdg') || input.includes('community') || input.includes('chapter')) {
        return {
          text: `I can help with GDG community management! Here are some areas I can assist with:

👥 **Community Building**
• Member engagement strategies
• Onboarding new members
• Building an inclusive environment

📅 **Event Management**
• Planning workshops and meetups
• Managing registrations and attendance
• Post-event follow-up

🤝 **Partnerships**
• Working with sponsors
• Collaborating with other tech communities
• Connecting with Google Developer Experts

What aspect of community management interests you most?`,
          context: {
            intent: 'community_management',
            confidence: 0.90,
            memoryUsed: false,
            knowledgeUsed: true
          }
        };
      }
      
      // Default response
      return {
        text: `I'd be happy to help! I can assist with:

• **Event Planning** - Organizing workshops, meetups, and study jams
• **Content Creation** - Social media posts and promotional materials  
• **Technical Questions** - Flutter, Firebase, and development topics
• **Community Management** - Growing and engaging your GDG chapter

Could you tell me more about what you're looking for help with?`,
        context: {
          intent: 'general_help',
          confidence: 0.75,
          memoryUsed: false,
          knowledgeUsed: false
        }
      };
    } catch (error) {
      console.error('Agent processing error:', error);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const drawerWidth = isMobile ? '100%' : 380;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          overflow: 'hidden',
          boxShadow: '-4px 0px 10px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BotIcon sx={{ mr: 1 }} />
          <Typography variant="h6">GDG Companion</Typography>
        </Box>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Container */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: 'calc(100vh - 132px)', // Header + Input height
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            {/* Avatar */}
            {message.sender === 'agent' ? (
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 36,
                  height: 36,
                  mr: 1,
                }}
              >
                <BotIcon fontSize="small" />
              </Avatar>
            ) : (
              <Avatar
                src={userProfile?.photoURL}
                sx={{
                  width: 36,
                  height: 36,
                  ml: 1,
                  bgcolor: theme.palette.secondary.main,
                }}
              >
                {userProfile?.displayName?.charAt(0) || 'U'}
              </Avatar>
            )}

            {/* Message Bubble */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: '75%',
                borderRadius: 2,
                backgroundColor:
                  message.sender === 'agent'
                    ? theme.palette.grey[100]
                    : theme.palette.primary.light,
                color:
                  message.sender === 'agent'
                    ? theme.palette.text.primary
                    : theme.palette.primary.contrastText,
                position: 'relative',
              }}
            >
              {message.processing ? (
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={20} />
                </Box>
              ) : (
                <>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                  
                  {/* Context indicators for assistant messages */}
                  {message.sender === 'agent' && message.context && (
                    <Box display="flex" gap={0.5} mt={1} flexWrap="wrap">
                      {message.context.memoryUsed && (
                        <Chip
                          size="small"
                          icon={<MemoryIcon />}
                          label="Memory"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.7rem' }}
                        />
                      )}
                      {message.context.knowledgeUsed && (
                        <Chip
                          size="small"
                          icon={<PsychologyIcon />}
                          label="Knowledge"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.7rem' }}
                        />
                      )}
                      {message.context.confidence && message.context.confidence > 0.8 && (
                        <Chip
                          size="small"
                          icon={<AIIcon />}
                          label="High Confidence"
                          color="success"
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  )}
                  
                  {/* Render structured data if available */}
                  {message.data && message.data.text && message.data.platform && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        {message.data.platform.charAt(0).toUpperCase() + message.data.platform.slice(1)} Post
                      </Typography>
                      <Typography variant="body2">{message.data.text}</Typography>
                    </Box>
                  )}
                  
                  {/* Timestamp */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: message.sender === 'agent' ? 'left' : 'right',
                      color: message.sender === 'agent' ? 'text.secondary' : 'rgba(255,255,255,0.7)',
                      mt: 0.5,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </>
              )}
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Field */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask your GDG Companion..."
            size="small"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            sx={{ ml: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CompanionChatbox;
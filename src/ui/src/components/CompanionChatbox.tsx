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
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { agentApi } from '../services/agentApi';

interface AgentResponse {
  text: string;
  data?: any;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  processing?: boolean;
  data?: any;
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
      text: 'Hi there! I\'m your GDG Community Companion. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
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
  const processAgentQuery = async (query: string): Promise<AgentResponse> => {
    try {
      // In a real implementation, you would call your agent API
      // This is a simplified example
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration purposes, we're returning hardcoded responses
      // In a real implementation, this would call the backend agent API
      
      if (query.toLowerCase().includes('event') && query.toLowerCase().includes('post')) {
        return {
          text: 'Here\'s a draft social media post for your event:',
          data: {
            text: "🚀 Join us for our upcoming Flutter Workshop on June 15th! Learn from expert developers and build your first Flutter app. Register now at gdg.community.dev/events/123",
            platform: "twitter"
          }
        };
      } else if (query.toLowerCase().includes('analytic') || query.toLowerCase().includes('performance')) {
        return {
          text: 'Based on your recent content performance, posts about workshops and coding sessions are getting the highest engagement. Consider focusing more on these topics.',
          data: {
            engagement_by_topic: {
              'workshops': 4.7,
              'coding sessions': 4.2,
              'networking': 3.1,
              'general announcements': 2.8
            }
          }
        };
      } else {
        return {
          text: 'I can help you create content for social media, analyze performance, manage your knowledge base, or schedule posts. What would you like to do today?',
        };
      }
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
                  <Typography variant="body1">{message.text}</Typography>
                  
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
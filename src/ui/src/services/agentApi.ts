import { getAuth } from 'firebase/auth';
import { app } from './firebase';

// Base URL for API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.gdgcompanion.dev';

// Types
export interface EventData {
  id?: string;
  title: string;
  date: string;
  time: string;
  description: string;
  link?: string;
  type: string;
  location?: string;
  speakers?: string[];
}

export interface SocialPost {
  id?: string;
  text: string;
  platform: string;
  event_id?: string;
  created_at: string;
  template_id?: string;
  scheduled_for?: string;
  performance_metrics?: {
    engagement_rate?: number;
    click_rate?: number;
    reach?: number;
  };
}

export interface KnowledgeItem {
  id?: string;
  title: string;
  content: string;
  type: string;
  layer: 'semantic' | 'kinetic' | 'dynamic';
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export interface ContentRequest {
  platform: string;
  event_data: EventData;
  template_id?: string;
}

export interface KnowledgeRequest {
  query: string;
  layer?: 'semantic' | 'kinetic' | 'dynamic';
  content_type?: string;
}

// Helper function to get auth token
const getAuthToken = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return user.getIdToken();
};

// Helper for API requests
const apiRequest = async (
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
) => {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Agent API functions
export const agentApi = {
  // Content generation
  generateContent: (request: ContentRequest) => 
    apiRequest('/content/generate', 'POST', request),
  
  // Knowledge management
  searchKnowledge: (request: KnowledgeRequest) => 
    apiRequest('/knowledge/search', 'POST', request),
  
  storeKnowledge: (item: KnowledgeItem) => 
    apiRequest('/knowledge/store', 'POST', item),
  
  // Content management
  getSocialPosts: (filters?: { platform?: string, from_date?: string, to_date?: string }) => 
    apiRequest(`/content/posts${filters ? `?${new URLSearchParams(filters as any).toString()}` : ''}`),
  
  schedulePost: (post: SocialPost) => 
    apiRequest('/content/schedule', 'POST', post),
  
  updatePostMetrics: (postId: string, metrics: SocialPost['performance_metrics']) => 
    apiRequest(`/content/posts/${postId}/metrics`, 'PUT', { metrics }),
  
  // Events
  getEvents: (filters?: { from_date?: string, to_date?: string, type?: string }) => 
    apiRequest(`/events${filters ? `?${new URLSearchParams(filters as any).toString()}` : ''}`),
  
  createEvent: (event: EventData) => 
    apiRequest('/events', 'POST', event),
  
  updateEvent: (eventId: string, event: Partial<EventData>) => 
    apiRequest(`/events/${eventId}`, 'PUT', event),
  
  // Templates
  getTemplates: (type?: string) => 
    apiRequest(`/templates${type ? `?type=${type}` : ''}`),
  
  createTemplate: (template: any) => 
    apiRequest('/templates', 'POST', template),
  
  // Analytics
  getContentAnalytics: (filters?: { platform?: string, from_date?: string, to_date?: string }) => 
    apiRequest(`/analytics/content${filters ? `?${new URLSearchParams(filters as any).toString()}` : ''}`),
  
  getEngagementTrends: (period: 'week' | 'month' | 'quarter' = 'month') => 
    apiRequest(`/analytics/engagement?period=${period}`),
};

export default agentApi;
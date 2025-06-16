// Common Types for the GDG Community Companion UI

export interface Chapter {
  id?: string;
  name: string;
  location: string;
  founded: string;
  member_count: number;
  website?: string;
  social_media?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
  logo_url?: string;
  description?: string;
}

export interface User {
  id?: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'viewer';
  chapterId: string;
  photoURL?: string;
}

export interface GDGEvent {
  id?: string;
  title: string;
  date: string;
  time: string;
  duration?: string;
  description: string;
  link?: string;
  type: 'meetup' | 'workshop' | 'conference' | 'hackathon' | 'online' | 'other';
  location?: string;
  speakers?: {
    name: string;
    title?: string;
    company?: string;
    photoURL?: string;
  }[];
  attendees_count?: number;
  created_by: string;
  created_at: string;
  updated_at?: string;
  status: 'draft' | 'scheduled' | 'completed' | 'cancelled';
  cover_image?: string;
}

export interface Template {
  id?: string;
  name: string;
  description?: string;
  type: 'event-announcement' | 'event-recap' | 'news' | 'welcome' | 'custom';
  template: string;
  platforms: ('twitter' | 'linkedin' | 'facebook' | 'instagram')[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  variables: string[];
}

export interface SocialPost {
  id?: string;
  text: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  event_id?: string;
  created_by: string;
  created_at: string;
  scheduled_for?: string;
  published_at?: string;
  template_id?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  performance_metrics?: {
    engagement_rate?: number;
    click_rate?: number;
    reach?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    clicks?: number;
    impressions?: number;
  };
  media_urls?: string[];
}

export interface KnowledgeItem {
  id?: string;
  title: string;
  content: string;
  type: 'template' | 'brand_voice' | 'workflow' | 'procedure' | 'best_practice' | 'performance_data' | 'general';
  layer: 'semantic' | 'kinetic' | 'dynamic';
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  text: string;
  data?: Record<string, any>;
}

export interface ContentAnalytics {
  platform: string;
  posts_count: number;
  average_engagement: number;
  engagement_trend: {
    date: string;
    value: number;
  }[];
  top_performing_posts: {
    post_id: string;
    text: string;
    engagement_rate: number;
    platform: string;
  }[];
  content_type_performance: {
    type: string;
    average_engagement: number;
  }[];
}

export interface ChapterSettings {
  id?: string;
  chapter_id: string;
  brand_colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  default_platforms: ('twitter' | 'linkedin' | 'facebook' | 'instagram')[];
  auto_scheduling: boolean;
  notification_emails: string[];
  approval_required: boolean;
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at?: string;
  published?: boolean;
  tags?: string[];
}

export interface Member {
  id?: string;
  name: string;
  email: string;
  joined_date: string;
  role?: string;
  active: boolean;
  chapter_id: string;
}
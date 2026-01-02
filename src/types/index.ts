export type UserRole = 'admin' | 'editor' | 'writer' | 'viewer';
export type BlogStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type BlogType = 'pillar' | 'cluster';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Domain {
  id: string;
  user_id: string;
  name: string;
  url: string | null;
  brand_voice: string | null;
  tone: string | null;
  style: string | null;
  forbidden_words: string[] | null;
  target_audience: string | null;
  default_cta_style: string | null;
  sanity_project_id: string | null;
  sanity_dataset: string | null;
  sanity_api_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Keyword {
  id: string;
  domain_id: string;
  keyword: string;
  search_volume: number | null;
  difficulty: number | null;
  intent: string | null;
  source: string | null;
  related_keywords: string[] | null;
  created_at: string;
}

export interface Blog {
  id: string;
  domain_id: string;
  user_id: string;
  title: string;
  slug: string | null;
  meta_description: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[] | null;
  blog_type: BlogType;
  parent_blog_id: string | null;
  outline: OutlineSection[] | null;
  content: string | null;
  word_count: number;
  reading_time: number;
  seo_score: number;
  readability_score: number;
  keyword_score: number;
  brand_voice_score: number;
  status: BlogStatus;
  scheduled_at: string | null;
  published_at: string | null;
  sanity_document_id: string | null;
  hero_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutlineSection {
  heading: string;
  level: 'h2' | 'h3' | 'h4';
  points: string[];
}

export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  alt_text: string | null;
  image_type: string | null;
  prompt: string | null;
  created_at: string;
}

export interface SocialContent {
  id: string;
  blog_id: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  created_at: string;
}

export interface GenerationSession {
  id: string;
  user_id: string;
  domain_id: string;
  current_step: number;
  topic: string | null;
  keywords: KeywordSuggestion[] | null;
  selected_keyword: string | null;
  blog_type: BlogType | null;
  titles: TitleVariant[] | null;
  selected_title: string | null;
  outline: OutlineSection[] | null;
  content: string | null;
  seo_scores: SEOScores | null;
  image_urls: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface KeywordSuggestion {
  keyword: string;
  source: 'ai' | 'google_suggest';
  intent: 'informational' | 'transactional' | 'navigational' | 'commercial';
  difficulty: 'low' | 'medium' | 'high';
  reasoning: string;
}

export interface TitleVariant {
  title: string;
  type: 'seo' | 'aeo' | 'geo' | 'conversion';
  score: number;
  reasoning: string;
}

export interface SEOScores {
  overall: number;
  readability: number;
  keyword_density: number;
  structure: number;
  meta_quality: number;
  suggestions: string[];
}

export interface DashboardStats {
  total_blogs: number;
  drafts: number;
  published: number;
  scheduled: number;
  avg_seo_score: number;
  total_words: number;
}

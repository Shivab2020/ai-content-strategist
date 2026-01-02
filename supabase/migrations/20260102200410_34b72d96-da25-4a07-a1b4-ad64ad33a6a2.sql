-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'writer', 'viewer');

-- Create blog status enum
CREATE TYPE blog_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

-- Create blog type enum
CREATE TYPE blog_type AS ENUM ('pillar', 'cluster');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'writer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create domains/brands table
CREATE TABLE public.domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  brand_voice TEXT,
  tone TEXT,
  style TEXT,
  forbidden_words TEXT[],
  target_audience TEXT,
  default_cta_style TEXT,
  sanity_project_id TEXT,
  sanity_dataset TEXT,
  sanity_api_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create keywords table
CREATE TABLE public.keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER,
  intent TEXT,
  source TEXT,
  related_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  meta_description TEXT,
  primary_keyword TEXT,
  secondary_keywords TEXT[],
  blog_type blog_type NOT NULL DEFAULT 'cluster',
  parent_blog_id UUID REFERENCES public.blogs(id) ON DELETE SET NULL,
  outline JSONB,
  content TEXT,
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  readability_score INTEGER DEFAULT 0,
  keyword_score INTEGER DEFAULT 0,
  brand_voice_score INTEGER DEFAULT 0,
  status blog_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  sanity_document_id TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog images table
CREATE TABLE public.blog_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  image_type TEXT,
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social content table
CREATE TABLE public.social_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  hashtags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generation sessions table for guided mode
CREATE TABLE public.generation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1,
  topic TEXT,
  keywords JSONB,
  selected_keyword TEXT,
  blog_type blog_type,
  titles JSONB,
  selected_title TEXT,
  outline JSONB,
  content TEXT,
  seo_scores JSONB,
  image_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Domains policies
CREATE POLICY "Users can view their own domains" ON public.domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own domains" ON public.domains FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own domains" ON public.domains FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own domains" ON public.domains FOR DELETE USING (auth.uid() = user_id);

-- Keywords policies
CREATE POLICY "Users can view keywords for their domains" ON public.keywords FOR SELECT USING (EXISTS (SELECT 1 FROM public.domains WHERE domains.id = keywords.domain_id AND domains.user_id = auth.uid()));
CREATE POLICY "Users can create keywords for their domains" ON public.keywords FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.domains WHERE domains.id = keywords.domain_id AND domains.user_id = auth.uid()));
CREATE POLICY "Users can delete keywords for their domains" ON public.keywords FOR DELETE USING (EXISTS (SELECT 1 FROM public.domains WHERE domains.id = keywords.domain_id AND domains.user_id = auth.uid()));

-- Blogs policies
CREATE POLICY "Users can view their own blogs" ON public.blogs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own blogs" ON public.blogs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own blogs" ON public.blogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own blogs" ON public.blogs FOR DELETE USING (auth.uid() = user_id);

-- Blog images policies
CREATE POLICY "Users can view images for their blogs" ON public.blog_images FOR SELECT USING (EXISTS (SELECT 1 FROM public.blogs WHERE blogs.id = blog_images.blog_id AND blogs.user_id = auth.uid()));
CREATE POLICY "Users can create images for their blogs" ON public.blog_images FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.blogs WHERE blogs.id = blog_images.blog_id AND blogs.user_id = auth.uid()));
CREATE POLICY "Users can delete images for their blogs" ON public.blog_images FOR DELETE USING (EXISTS (SELECT 1 FROM public.blogs WHERE blogs.id = blog_images.blog_id AND blogs.user_id = auth.uid()));

-- Social content policies
CREATE POLICY "Users can view social content for their blogs" ON public.social_content FOR SELECT USING (EXISTS (SELECT 1 FROM public.blogs WHERE blogs.id = social_content.blog_id AND blogs.user_id = auth.uid()));
CREATE POLICY "Users can create social content for their blogs" ON public.social_content FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.blogs WHERE blogs.id = social_content.blog_id AND blogs.user_id = auth.uid()));
CREATE POLICY "Users can delete social content for their blogs" ON public.social_content FOR DELETE USING (EXISTS (SELECT 1 FROM public.blogs WHERE blogs.id = social_content.blog_id AND blogs.user_id = auth.uid()));

-- Generation sessions policies
CREATE POLICY "Users can view their own sessions" ON public.generation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.generation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.generation_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON public.generation_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_generation_sessions_updated_at BEFORE UPDATE ON public.generation_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
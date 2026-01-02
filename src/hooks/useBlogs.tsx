import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Blog, BlogStatus, OutlineSection } from '@/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useBlogs(domainId?: string) {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && domainId) {
      fetchBlogs();
    }
  }, [user, domainId]);

  const fetchBlogs = async () => {
    if (!user || !domainId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('domain_id', domainId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch blogs');
      console.error(error);
    } else {
      const transformedData = data.map(blog => ({
        ...blog,
        outline: blog.outline as unknown as OutlineSection[] | null
      })) as Blog[];
      setBlogs(transformedData);
    }
    setLoading(false);
  };

  const createBlog = async (blog: Omit<Blog, 'id' | 'domain_id' | 'user_id' | 'created_at' | 'updated_at'> & { title: string }) => {
    if (!user || !domainId) return null;

    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title: blog.title,
        domain_id: domainId,
        user_id: user.id,
        slug: blog.slug,
        meta_description: blog.meta_description,
        primary_keyword: blog.primary_keyword,
        secondary_keywords: blog.secondary_keywords,
        blog_type: blog.blog_type,
        parent_blog_id: blog.parent_blog_id,
        content: blog.content,
        word_count: blog.word_count,
        reading_time: blog.reading_time,
        seo_score: blog.seo_score,
        readability_score: blog.readability_score,
        keyword_score: blog.keyword_score,
        brand_voice_score: blog.brand_voice_score,
        status: blog.status,
        scheduled_at: blog.scheduled_at,
        published_at: blog.published_at,
        sanity_document_id: blog.sanity_document_id,
        hero_image_url: blog.hero_image_url,
        outline: blog.outline ? JSON.parse(JSON.stringify(blog.outline)) : null
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create blog');
      console.error(error);
      return null;
    }

    toast.success('Blog created successfully');
    fetchBlogs();
    return {
      ...data,
      outline: data.outline as unknown as OutlineSection[] | null
    } as Blog;
  };

  const updateBlog = async (id: string, updates: Partial<Blog>) => {
    const updatePayload: Record<string, unknown> = { ...updates };
    if (updates.outline) {
      updatePayload.outline = JSON.parse(JSON.stringify(updates.outline));
    }

    const { error } = await supabase
      .from('blogs')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      toast.error('Failed to update blog');
      console.error(error);
      return false;
    }

    toast.success('Blog updated successfully');
    fetchBlogs();
    return true;
  };

  const deleteBlog = async (id: string) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete blog');
      console.error(error);
      return false;
    }

    toast.success('Blog deleted successfully');
    fetchBlogs();
    return true;
  };

  const getBlogsByStatus = (status: BlogStatus) => {
    return blogs.filter(blog => blog.status === status);
  };

  const getStats = () => {
    const total = blogs.length;
    const drafts = blogs.filter(b => b.status === 'draft').length;
    const published = blogs.filter(b => b.status === 'published').length;
    const scheduled = blogs.filter(b => b.status === 'scheduled').length;
    const avgSeoScore = total > 0 
      ? Math.round(blogs.reduce((sum, b) => sum + b.seo_score, 0) / total)
      : 0;
    const totalWords = blogs.reduce((sum, b) => sum + b.word_count, 0);

    return { total, drafts, published, scheduled, avgSeoScore, totalWords };
  };

  return {
    blogs,
    loading,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogsByStatus,
    getStats,
    refreshBlogs: fetchBlogs
  };
}

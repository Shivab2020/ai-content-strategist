import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Domain } from '@/types';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useDomains() {
  const { user } = useAuth();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);

  const fetchDomains = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch domains');
      console.error(error);
    } else {
      setDomains(data as Domain[]);
      if (data.length > 0 && !selectedDomain) {
        setSelectedDomain(data[0] as Domain);
      }
    }
    setLoading(false);
  };

  const createDomain = async (domain: { name: string } & Partial<Omit<Domain, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('domains')
      .insert([{ 
        name: domain.name,
        user_id: user.id,
        url: domain.url,
        brand_voice: domain.brand_voice,
        tone: domain.tone,
        style: domain.style,
        forbidden_words: domain.forbidden_words,
        target_audience: domain.target_audience,
        default_cta_style: domain.default_cta_style,
        sanity_project_id: domain.sanity_project_id,
        sanity_dataset: domain.sanity_dataset,
        sanity_api_token: domain.sanity_api_token
      }])
      .select()
      .single();

    if (error) {
      toast.error('Failed to create domain');
      console.error(error);
      return null;
    }

    toast.success('Domain created successfully');
    fetchDomains();
    return data as Domain;
  };

  const updateDomain = async (id: string, updates: Partial<Domain>) => {
    const { error } = await supabase
      .from('domains')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error('Failed to update domain');
      console.error(error);
      return false;
    }

    toast.success('Domain updated successfully');
    fetchDomains();
    return true;
  };

  const deleteDomain = async (id: string) => {
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete domain');
      console.error(error);
      return false;
    }

    toast.success('Domain deleted successfully');
    if (selectedDomain?.id === id) {
      setSelectedDomain(null);
    }
    fetchDomains();
    return true;
  };

  return {
    domains,
    loading,
    selectedDomain,
    setSelectedDomain,
    createDomain,
    updateDomain,
    deleteDomain,
    refreshDomains: fetchDomains
  };
}

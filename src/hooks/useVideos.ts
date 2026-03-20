import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Video = Tables<'videos'>;

export const useVideos = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['videos', searchQuery],
    queryFn: async () => {
      let query = supabase.from('videos').select('*').order('created_at', { ascending: false });

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        query = supabase
          .from('videos')
          .select('*')
          .or(`title.ilike.%${q}%,category.ilike.%${q}%,tags.cs.{${q}}`)
          .order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Video[];
    },
    staleTime: 30000,
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Video;
    },
    enabled: !!id,
  });
};

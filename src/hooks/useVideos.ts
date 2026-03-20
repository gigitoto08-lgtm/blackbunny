import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Video = Tables<'videos'>;

export const useVideos = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['videos', searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (error) throw error;

      if (!searchQuery) {
        return data as Video[];
      }

      const q = searchQuery.toLowerCase().trim();

      return (data as Video[]).filter((video) =>
        [
          video.title,
          video.category,
          video.channel,
          ...(video.tags || []),
          ...(video.pornstars || []),
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(q))
      );
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

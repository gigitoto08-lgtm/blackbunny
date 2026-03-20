import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRecordView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      await supabase.rpc('increment_video_views', { vid: videoId });
      await supabase.from('video_views').insert({ video_id: videoId, user_id: user?.id || null });
      if (user) {
        await supabase.from('watch_history').insert({ user_id: user.id, video_id: videoId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video'] });
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const { data, error } = await supabase.rpc('toggle_like', { vid: videoId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
    },
  });
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!user) throw new Error('Must be logged in');
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .maybeSingle();

      if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
        return false;
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, video_id: videoId });
        return true;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
    },
  });
};

export const useUserLikes = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['userLikes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('likes').select('video_id').eq('user_id', user.id);
      return (data || []).map((l) => l.video_id);
    },
    enabled: !!user,
  });
};

export const useUserFavorites = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['userFavorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('favorites')
        .select('video_id, videos(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });
};

export const useWatchHistory = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['watchHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('watch_history')
        .select('video_id, watched_at, videos(*)')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(50);
      return data || [];
    },
    enabled: !!user,
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      return data;
    },
    enabled: !!user,
  });
};

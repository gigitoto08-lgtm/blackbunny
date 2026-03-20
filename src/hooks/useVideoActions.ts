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
      return { videoId, liked: data };
    },
    onMutate: async (videoId: string) => {
      await queryClient.cancelQueries({ queryKey: ['video', videoId] });
      await queryClient.cancelQueries({ queryKey: ['videos'] });
      await queryClient.cancelQueries({ queryKey: ['userLikes'] });

      const previousVideo = queryClient.getQueryData<any>(['video', videoId]);
      const previousVideos = queryClient.getQueriesData({ queryKey: ['videos'] });
      const previousUserLikes = queryClient.getQueriesData({ queryKey: ['userLikes'] });
      const isLiked = previousUserLikes.flatMap(([, data]) => (Array.isArray(data) ? data : [])).includes(videoId);
      const nextLiked = !isLiked;

      queryClient.setQueryData(['video', videoId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          likes: Math.max((old.likes || 0) + (nextLiked ? 1 : -1), 0),
        };
      });

      previousVideos.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!Array.isArray(old)) return old;
          return old.map((video) =>
            video.id === videoId
              ? { ...video, likes: Math.max((video.likes || 0) + (nextLiked ? 1 : -1), 0) }
              : video
          );
        });
      });

      previousUserLikes.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!Array.isArray(old)) return old;
          return nextLiked ? [...old, videoId] : old.filter((id: string) => id !== videoId);
        });
      });

      return { previousVideo, previousVideos, previousUserLikes, videoId };
    },
    onError: (_error, videoId, context) => {
      if (!context) return;
      queryClient.setQueryData(['video', videoId], context.previousVideo);
      context.previousVideos.forEach(([queryKey, data]: [readonly unknown[], unknown]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context.previousUserLikes.forEach(([queryKey, data]: [readonly unknown[], unknown]) => {
        queryClient.setQueryData(queryKey, data);
      });
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
      const { data, error } = await supabase.from('likes').select('video_id').eq('user_id', user.id);
      if (error) throw error;
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


-- Replace the overly permissive insert policy on video_views with a more specific one
DROP POLICY "Anyone can insert views" ON public.video_views;
CREATE POLICY "Anyone can insert views" ON public.video_views FOR INSERT WITH CHECK (video_id IS NOT NULL);

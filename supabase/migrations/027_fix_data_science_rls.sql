-- Migration 027: Fix RLS on data science tables — authenticated users need INSERT
-- competitor_intel and kl_effectiveness were missing INSERT policies for
-- authenticated users, causing 403 errors on client-side fire-and-forget logging.

-- competitor_intel: add INSERT for authenticated users
CREATE POLICY "Users insert" ON public.competitor_intel
  FOR INSERT TO authenticated WITH CHECK (true);

-- kl_effectiveness: add INSERT for authenticated users
CREATE POLICY "Users insert" ON public.kl_effectiveness
  FOR INSERT TO authenticated WITH CHECK (true);

-- kl_effectiveness: also needs SELECT for users to read their own data
CREATE POLICY "Users read" ON public.kl_effectiveness
  FOR SELECT TO authenticated USING (true);

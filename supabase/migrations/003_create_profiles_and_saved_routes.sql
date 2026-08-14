-- === PROFILES TABLE (Linked to auth.users) ===
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Wisatawan Osing',
  avatar_url TEXT DEFAULT NULL,
  persona_title TEXT DEFAULT 'Penjelajah Blambangan',
  travel_style TEXT DEFAULT 'santai',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, persona_title)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Wisatawan Osing'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data->>'persona_title', 'Penjelajah Blambangan')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- === USER SAVED ROUTES (Cloud Itineraries) ===
CREATE TABLE IF NOT EXISTS public.user_saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  corridor_id TEXT DEFAULT 'jalur-ijen-utara',
  destinations JSONB NOT NULL DEFAULT '[]', -- List of Destination objects
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_saved_routes
ALTER TABLE public.user_saved_routes ENABLE ROW LEVEL SECURITY;

-- User Saved Routes Policies
CREATE POLICY "Users can view their own saved routes" 
  ON public.user_saved_routes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved routes" 
  ON public.user_saved_routes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved routes" 
  ON public.user_saved_routes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved routes" 
  ON public.user_saved_routes FOR DELETE USING (auth.uid() = user_id);

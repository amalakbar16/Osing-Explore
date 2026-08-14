import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lutszuypawggamkugxdx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dHN6dXlwYXdnZ2Fta3VneGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjU1MTksImV4cCI6MjEwMjIwMTUxOX0.ZZYzPX32sa7EEnWNT_A1TMd6NW2Rlgi8DJlG8MvwiUA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

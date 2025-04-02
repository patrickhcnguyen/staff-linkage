
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use the values from src/integrations/supabase/client.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zyywzijkpsnwjierldqz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eXd6aWprcHNud2ppZXJsZHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDkwMDAsImV4cCI6MjA1OTEyNTAwMH0.uyy78O50XUkTlbIVByqs-P0eqN5NV883ihQsrHzqOeE';

// Hard-code the Lovable domain for this project
const siteUrl = 'https://staff-linkage.lovable.space';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
  },
  global: {
    headers: {
      'x-application-name': 'event-staff-app',
    },
  },
});

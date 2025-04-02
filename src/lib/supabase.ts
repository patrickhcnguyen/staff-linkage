
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use the values from src/integrations/supabase/client.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxzbxvtjxpjhoqjzmkrq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54emJ4dnRqeHBqaG9xanpta3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMjM2OTAsImV4cCI6MjA1Njg5OTY5MH0.sROjmbl8ROzFvmWC9SJjz9MQzGuCq5QfpsuS7-gM_ZY';

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

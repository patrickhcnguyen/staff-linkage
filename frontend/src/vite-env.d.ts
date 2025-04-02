
/// <reference types="vite/client" />

import { SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    supabase?: SupabaseClient;
  }
}

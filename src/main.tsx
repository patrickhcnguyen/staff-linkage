
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase'

// Make supabase available in console for debugging
if (import.meta.env.DEV) {
  window.supabase = supabase;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper Fungsi CDN Google Drive agar foto tampil stabil
export function formatDriveUrl(url) {
  if (!url) return '';

  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || 
                url.match(/id=([a-zA-Z0-9_-]+)/) ||
                url.match(/file\/d\/([a-zA-Z0-9_-]+)/);

  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  return url;
}
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cjdyctkinpqfnrcwmvnu.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hibcyY89pUnJJFA014LKGQ_nb2tvugH';

// Create single Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Storage buckets
export type StorageBucket = 'product-logos' | 'product-screenshots' | 'user-avatars';

// Upload asset with client-side file size and mime validation
export async function uploadAsset(
  bucket: StorageBucket,
  file: File,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      return { url: null, error: 'Only JPEG, PNG, WebP, or SVG images are allowed.' };
    }

    // Validate size
    const maxSizeBytes = bucket === 'product-screenshots' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const maxMb = bucket === 'product-screenshots' ? 5 : 2;
      return { url: null, error: `File exceeds maximum limit of ${maxMb}MB.` };
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      console.warn('Supabase storage upload fallback:', uploadError.message);
      // Fallback: create base64 object URL for immediate display
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string, error: null });
        };
        reader.readAsDataURL(file);
      });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'File upload failed' };
  }
}

// Check if Supabase tables are initialized
let _isConnectedCache: boolean | null = null;
export async function checkSupabaseConnected(): Promise<boolean> {
  if (_isConnectedCache !== null) return _isConnectedCache;
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (!error) {
      _isConnectedCache = true;
      return true;
    }
    // If table doesn't exist (PGRST205)
    _isConnectedCache = false;
    return false;
  } catch {
    _isConnectedCache = false;
    return false;
  }
}

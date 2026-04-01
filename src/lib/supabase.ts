import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// anon key는 공개 가능한 키입니다 — secret key는 절대 사용 금지
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY 누락');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveGame(original: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('games')
    .insert({ original })
    .select('id')
    .single();
  if (error || !data) return null;
  return data.id as string;
}

export async function loadGame(id: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('games')
    .select('original')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data.original as string;
}

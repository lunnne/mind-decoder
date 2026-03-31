// Supabase client — plug in credentials via .env to enable cloud storage.
//
// Current state: URL-encoded sharing (no backend needed for MVP).
//
// To enable Supabase:
//   1. Create a .env file:
//        VITE_SUPABASE_URL=https://your-project.supabase.co
//        VITE_SUPABASE_ANON_KEY=your-anon-key
//   2. Create a `games` table:
//        id          uuid  primary key default gen_random_uuid()
//        original    text  not null
//        created_at  timestamptz default now()
//   3. In CreatePage, replace encodeGameData() with saveGame() and route to /game/:id
//   4. In GamePage, add a route /game/:id that calls loadGame(id)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// 반드시 publishable key 사용 — secret key는 브라우저에 노출되므로 절대 사용 금지
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined;

export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveGame(original: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('games')
    .insert({ original })
    .select('id')
    .single();
  if (error || !data) return null;
  return data.id as string;
}

export async function loadGame(id: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('games')
    .select('original')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data.original as string;
}




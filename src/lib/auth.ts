import { supabase } from './supabase';

let _sessionPromise: Promise<void> | null = null;

/**
 * 익명 세션을 보장합니다.
 * 이미 세션이 있으면 재사용, 없으면 anonymous sign-in.
 * 중복 호출 시 동일한 Promise를 반환합니다.
 */
export function ensureAnonymousSession(): Promise<void> {
  if (_sessionPromise) return _sessionPromise;

  _sessionPromise = (async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return;

      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (err) {
      // 다음 호출에서 재시도할 수 있도록 캐시 초기화
      _sessionPromise = null;
      console.error('[auth] 익명 로그인 실패:', err);
      throw err;
    }
  })();

  return _sessionPromise;
}

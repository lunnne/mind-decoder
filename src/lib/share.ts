import { nanoid } from 'nanoid';

/**
 * 12자 URL-safe 랜덤 ID (예: "V1StGXR8_Z5j")
 */
export function createShareId(): string {
  return nanoid(12);
}

/**
 * 읽기 쉬운 slug용 21자 ID
 * nanoid 기본 알파벳(A-Za-z0-9_-)은 URL-safe
 */
export function createShareSlug(): string {
  return nanoid(21);
}

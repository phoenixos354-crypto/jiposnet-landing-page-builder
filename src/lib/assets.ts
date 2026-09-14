/**
 * assets.ts
 * Helper aman-diimpor-client untuk mengubah path relatif hasil upload
 * (contoh: "/api/uploads/hero-xxx.jpg") menjadi URL absolut ke domain
 * shared hosting tempat PHP API & folder uploads berada.
 *
 * VITE_ASSETS_BASE_URL wajib diisi sama dengan domain shared hosting
 * (tanpa trailing slash), contoh: https://jipos.net
 */

const ASSETS_BASE_URL = (import.meta.env["VITE_ASSETS_BASE_URL"] ?? "").replace(/\/+$/, "");

/**
 * Return URL gambar untuk ditampilkan. Kalau `path` kosong, return null
 * supaya pemanggil bisa fallback ke aset bawaan (bundled default image).
 */
export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSETS_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

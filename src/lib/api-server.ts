/**
 * api-server.ts
 * Helper SERVER-ONLY untuk memanggil PHP REST API di shared hosting.
 * JANGAN import file ini dari komponen client — hanya dipakai di dalam
 * `.handler()` server function (lihat src/server/*.server.ts).
 */

import { CONTENT_CACHE_TAG } from "@/lib/content-types";

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface CallApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string | null;
  json?: unknown;
  formData?: FormData;
  query?: Record<string, string | number | undefined>;
}

function getApiBaseUrl(): string {
  const url = process.env["API_BASE_URL"];
  if (!url) {
    throw new Error("API_BASE_URL belum diset di environment variables Vercel.");
  }
  return url.replace(/\/+$/, "");
}

function getApiSecretKey(): string {
  return process.env["API_SECRET_KEY"] ?? "";
}

/**
 * Panggil satu endpoint PHP API. Selalu mengembalikan bentuk { success, data|error }
 * yang konsisten, bahkan kalau terjadi error jaringan (tidak melempar exception),
 * supaya pemanggil (server function) bisa menampilkan pesan yang ramah ke admin.
 */
export async function callApi<T>(path: string, options: CallApiOptions = {}): Promise<ApiResult<T>> {
  let baseUrl: string;
  try {
    baseUrl = getApiBaseUrl();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }

  const headers: Record<string, string> = {
    "X-Api-Key": getApiSecretKey(),
  };
  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData; // fetch akan set Content-Type multipart otomatis
  } else if (options.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.json);
  }

  let url = `${baseUrl}${path}`;
  if (options.query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined) params.set(key, String(value));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const fetchInit: RequestInit = {
    method: options.method ?? "GET",
    headers,
  };
  if (body !== undefined) {
    fetchInit.body = body;
  }

  try {
    const res = await fetch(url, fetchInit);
    const text = await res.text();
    let json: ApiResult<T>;
    try {
      json = JSON.parse(text) as ApiResult<T>;
    } catch {
      return { success: false, error: `Respons API tidak valid (HTTP ${res.status}).` };
    }
    return json;
  } catch {
    return { success: false, error: "Tidak dapat terhubung ke server API. Coba lagi sebentar lagi." };
  }
}

/**
 * Purge cache Vercel CDN by tag (lihat B5). Dipanggil setelah admin berhasil
 * menyimpan perubahan, supaya perubahan tampil di landing page tanpa menunggu
 * s-maxage habis. Dilewati secara diam-diam kalau VERCEL_API_TOKEN belum diset
 * (misalnya saat development lokal) — tidak membuat permintaan admin gagal.
 */
export async function purgeContentCache(): Promise<void> {
  const token = process.env["VERCEL_API_TOKEN"];
  const projectId = process.env["VERCEL_PROJECT_ID"];
  if (!token || !projectId) {
    return; // fitur opsional — tidak wajib untuk development
  }

  const params = new URLSearchParams({ projectIdOrName: projectId });
  if (process.env["VERCEL_TEAM_ID"]) {
    params.set("teamId", process.env["VERCEL_TEAM_ID"] as string);
  }

  try {
    await fetch(`https://api.vercel.com/v1/edge-cache/invalidate-by-tags?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags: [CONTENT_CACHE_TAG], target: "production" }),
    });
  } catch {
    // Purge cache bersifat best-effort — kegagalan di sini tidak boleh
    // menggagalkan penyimpanan konten. Halaman tetap akan segar lewat
    // stale-while-revalidate dalam waktu singkat.
  }
}

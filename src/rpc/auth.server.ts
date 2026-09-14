import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { callApi } from "@/lib/api-server";

const COOKIE_NAME = "jiposnet_admin_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari, selaras dengan JWT_EXPIRY_SECONDS default di backend

interface LoginResponse {
  token: string;
  email: string;
  expires_in: number;
}

interface LoginInput {
  email: string;
  password: string;
}

/**
 * Decode payload JWT tanpa verifikasi signature (hanya untuk baca "exp"/"email"
 * di sisi UI). Keamanan sebenarnya tetap ditegakkan oleh PHP API yang
 * memverifikasi signature dengan JWT_SECRET miliknya sendiri di setiap request.
 */
function decodeJwtPayload(token: string): { email?: string; exp?: number } | null {
  try {
    const [, payloadB64] = token.split(".");
    if (!payloadB64) return null;
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const json = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: LoginInput) => data)
  .handler(async ({ data }) => {
    const result = await callApi<LoginResponse>("/login.php", {
      method: "POST",
      json: { email: data.email, password: data.password },
    });

    if (!result.success || !result.data) {
      return { success: false as const, error: result.error ?? "Login gagal." };
    }

    setCookie(COOKIE_NAME, result.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return { success: true as const, email: result.data.email };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { success: true as const };
});

export interface SessionInfo {
  authenticated: boolean;
  email?: string | undefined;
}

export const getSessionFn = createServerFn({ method: "GET" }).handler(async (): Promise<SessionInfo> => {
  const token = getCookie(COOKIE_NAME);
  if (!token) {
    return { authenticated: false };
  }
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp || Date.now() >= payload.exp * 1000) {
    deleteCookie(COOKIE_NAME, { path: "/" });
    return { authenticated: false };
  }
  return { authenticated: true, email: payload.email };
});

export const changePasswordFn = createServerFn({ method: "POST" })
  .validator((data: { currentPassword: string; newPassword: string }) => data)
  .handler(async ({ data }) => {
    const token = getCookie(COOKIE_NAME);
    if (!token) {
      return { success: false as const, error: "Sesi tidak ditemukan, silakan masuk kembali." };
    }
    const result = await callApi("/change-password.php", {
      method: "POST",
      token,
      json: { current_password: data.currentPassword, new_password: data.newPassword },
    });
    return result.success
      ? { success: true as const }
      : { success: false as const, error: result.error ?? "Gagal mengganti password." };
  });

/**
 * Dipakai oleh server function lain (content/paket/testimoni/upload) untuk
 * mengambil token dari cookie sebelum proxy ke PHP API. Melempar error kalau
 * tidak ada sesi aktif, supaya endpoint tidak pernah diteruskan tanpa auth.
 * Dibungkus createServerOnlyFn supaya bundler tahu ini tidak pernah boleh
 * ikut ke bundle client, meski dipanggil dari dalam handler server function lain.
 */
export const requireAdminToken = createServerOnlyFn((): string => {
  const token = getCookie(COOKIE_NAME);
  if (!token) {
    throw new Error("UNAUTHENTICATED");
  }
  return token;
});

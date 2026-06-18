import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./tokenStore";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const jsonInit = (method: string, body: object): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// Unauthenticated helpers used during the auth flow itself.
export const api = {
  requestOtp: (mobile: string) =>
    fetch(`${BASE_URL}/auth/otp/request`, jsonInit("POST", { mobile })),

  verifyOtp: (mobile: string, otp: string) =>
    fetch(`${BASE_URL}/auth/otp/verify`, jsonInit("POST", { mobile, otp })),
};

export async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const doRequest = async (token: string | null): Promise<Response> =>
    fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  const accessToken = await getAccessToken();
  const res = await doRequest(accessToken);

  if (res.status !== 401) return res;

  // --- Access token expired: attempt a silent refresh ---
  const storedRefreshToken = await getRefreshToken();
  if (!storedRefreshToken) {
    useAuthStore.getState().clearSession();
    return res;
  }

  const refreshRes = await fetch(
    `${BASE_URL}/auth/token/refresh`,
    jsonInit("POST", { refreshToken: storedRefreshToken })
  );

  if (!refreshRes.ok) {
    // Refresh token is also expired or revoked — force logout.
    await clearTokens();
    useAuthStore.getState().clearSession();
    return refreshRes;
  }

  const { accessToken: newAccess, refreshToken: newRefresh } = await refreshRes.json();
  await saveTokens(newAccess, newRefresh);

  // Retry the original request with the fresh access token.
  return doRequest(newAccess);
}

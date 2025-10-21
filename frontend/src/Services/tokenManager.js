import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { authService } from "../Services/authService";

let refreshTimeout;

export const scheduleTokenRefresh = (token) => {
  if (!token) return;

  const { exp } = jwtDecode(token); // expiry in seconds
  const expiresInMs = exp * 1000 - Date.now();
  const refreshInMs = expiresInMs - 60 * 1000; // refresh 1 min before expiry

  if (refreshTimeout) clearTimeout(refreshTimeout);

  refreshTimeout = setTimeout(async () => {
    try {
      const newToken = await authService.refreshToken();
      Cookies.set("access_token", newToken);
      scheduleTokenRefresh(newToken); // reschedule again
    } catch (err) {
      console.error("Auto-refresh failed:", err);
    }
  }, refreshInMs);
};

export default scheduleTokenRefresh;
import Cookies from "js-cookie";
import { scheduleTokenRefresh } from "./tokenManager";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

let cachedRoles = null;

export const authService = {
  // store tokens in cookies
  setToken: (accessToken, refreshToken) => {
    const { exp } = jwtDecode(accessToken);
  const expiryDate = new Date(exp * 1000);

    const isSecure = typeof window !== "undefined" && window.location && window.location.protocol === "https:";

    Cookies.set(ACCESS_TOKEN, accessToken, {
      expires: expiryDate, // from backend
      secure: isSecure, // only secure over HTTPS
      sameSite: "Lax",
    });
    Cookies.set(REFRESH_TOKEN, refreshToken, {
      expires: 30,
      secure: isSecure,
      sameSite: "Lax",
    });

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  },

  getCurrentToken: () => {
    const token = Cookies.get(ACCESS_TOKEN);
  if (token) return token;

  // Fallback: maybe axios default header was set directly (e.g., during login)
  const header = api && api.defaults && api.defaults.headers && api.defaults.headers.common && api.defaults.headers.common.Authorization;
  if (header) return header.replace(/^Bearer\s+/i, "");

  // nothing found
  },

  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN);
  },

  // Remove token on logout
  logout: async () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
    delete api.defaults.headers.common["Authorization"];
    cachedRoles = null;
  },

  refreshToken: async () => {
    try {
      const refreshToken = Cookies.get(REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.post("/auth/v1/refreshToken", {
        token: refreshToken,
      });
      // console.log("Access Token after refresh: " , response)
      const { accessToken, token: newRefreshToken } = response.data;
      if (!accessToken) throw new Error("Invalid refresh token response");

      authService.setToken(accessToken, newRefreshToken);
      return accessToken;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Something went wrong during token refresh";

      console.error("Token refresh failed:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  login: async (Credentials) => {
    try {
      // console.log("Login...");
      // console.log("credentials", Credentials);
      const response = await api.post("/auth/v1/login", Credentials);
      // console.log("Login response:", response.data);

      if (response.data) {
        // const { token, roles, email, name, userId } = response.data;
        const { accessToken, token: refreshToken } = response.data;

        authService.setToken(accessToken, refreshToken);
        scheduleTokenRefresh(accessToken);
        return response.data;
      }
    } catch (error) {
      // Optional: clear data on failed login attempt
      authService.logout();
      throw error;
    }
  },

  signup: async (Credentials) => {
    try {
      const response = await api.post("/auth/v1/signup", Credentials);
      // console.log("SignUp response: ", response.data);
      if (response.data) {
        const { accessToken, token: refreshToken } = response.data;
        authService.setToken(accessToken, refreshToken);

        return response.data;
      }
    } catch (error) {
      // Optional: clear data on failed login attempt
      authService.logout();
      throw error;
    }
  },

  getUserRoles: () => {
    if (cachedRoles) return cachedRoles;

    const token = Cookies.get(ACCESS_TOKEN);
    if (!token) return [];

    try {
      const decoded = jwtDecode(token);
      cachedRoles = decoded.roles || [];
      return cachedRoles;
    } catch {
      return [];
    }
  },

  hasRole: (role) => {
    return authService.getUserRoles().includes(role);
  },

  isAuthenticated: async () => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      // console.log("isAuthenticated : ", exp * 1000 > Date.now());
      if (exp * 1000 > Date.now()) {
        return true;
      }

      // expired -> try refresh
      try {
        const newToken = await authService.refreshToken();
        return !!newToken;
      } catch {
        await authService.logout();
        return false;
      }
    } catch {
      return false;
    }
  },

  getCurrentUser: async () => {
    const isAuth = await authService.isAuthenticated();
    if (isAuth) {
      try {
        const response = await api.get("/auth/v1/current-user");
        // console.log(" user details => " ,response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
      }
    }
    return null;
  },
};

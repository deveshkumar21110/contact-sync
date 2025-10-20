import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../conf/config";
import { authService } from "../Services/authService";

const TOKEN_KEY = "access_token";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL.backendUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ===== Refresh Token Queue Logic =====
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newToken = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(newToken);
  });
  failedQueue = [];
};

// ===== Request Interceptor =====
api.interceptors.request.use(
  async (config) => {
    const noAuthEndpoints = [
      "/auth/v1/login",
      "/auth/v1/signup",
      "/auth/v1/refreshToken",
    ];

    const isNoAuth = noAuthEndpoints.some((endpoint) =>
      config.url.endsWith(endpoint)
    );

    if (!isNoAuth) {
      let token = await authService.getCurrentToken();

      // If no access token, but refresh token exists → try refreshing
      if (!token && authService.hasRefreshToken()) {
        try {
          token = await authService.refreshToken();
          Cookies.set(TOKEN_KEY, token);
        } catch (err) {
          console.error("Token refresh failed (request interceptor):", err);
          return config; // send request without token, backend will handle
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry on 401 (expired access token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newToken = await authService.refreshToken();
        Cookies.set(TOKEN_KEY, newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error("Token refresh failed (response interceptor):", refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

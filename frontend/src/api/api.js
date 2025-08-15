import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "../conf/config";
import { authService } from "../Services/authService";

const TOKEN_KEY = "access_token"; // Fixed to match authService

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL.backendUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request Interceptor – add Authorization token if available
api.interceptors.request.use(
  async (config) => {
    // console.log("==== OUTGOING REQUEST ====");
    // console.log("URL:", config.url);
    // console.log("Method:", config.method);
    // console.log("Headers:", config.headers);
    // console.log("Params:", config.params);
    // console.log("Data (body):", config.data);
    // console.log("==========================");

    const noAuthEndpoints = [
      "/auth/v1/login",
      "/auth/v1/signup",
      "/auth/v1/refreshToken"
    ];
    const isNoAuth = noAuthEndpoints.some(endpoint =>
      config.url.endsWith(endpoint)
    );
    if (!isNoAuth) {
      const token = await authService.getCurrentToken();
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


// ===== Refresh Token Logic ===== //
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, newToken = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(newToken);
    }
  });
  failedQueue = [];
};

// Response Interceptor – auto refresh on 401
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Skip if already retried once
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
        const newToken = await authService.refreshToken(); // Fixed method name
        Cookies.set(TOKEN_KEY, newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Don't automatically logout and redirect, let the component handle it
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

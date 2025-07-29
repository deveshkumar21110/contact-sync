import Cookies from "js-cookie";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "access_token";
let cachedRoles = null;

export const authService = {
  // store tokens in cookies
  setToken: (token) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // valid for 7 days only
      secure: true, // HTTPS only (set false if localhost)
      sameSite: "Lax", // 'Strict' or 'None' depending on your needs
    });
  },

  // Get Current Token
  // getCurrentToken: async () => {
  //   // const response = await api.get("/auth/v1/refreshToken");
  //   const response = await api.get("/auth/v1/refreshToken", null, {
  //     headers: { Authorization: `Bearer ${TOKEN_KEY}` },
  //   });
  //   if(response.data){
  //     return response.data.token;
  //   }
  //   return null;
  // },

  getCurrentToken: async () => {
    const token  = Cookies.get(TOKEN_KEY);
    if(token) {
      // console.log("Current token:", token);
      return token;
    }
    console.warn("No token found");
  },

  getRefreshToken: () => {
    return Cookies.get("refresh_token");
  },

  // Remove token on logout
  logout: async () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    cachedRoles = null;
  },

  refreshToken: async () => {
    try {
      const refreshToken = Cookies.get("refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.post("/auth/v1/refreshToken", {
        token: refreshToken
      });

      const newToken = response.data?.accessToken;
      if (!newToken) throw new Error("Invalid refresh token response");

      Cookies.set(TOKEN_KEY, newToken, {
        expires: 7,
        secure: true,
        sameSite: "Lax",
      });
      return newToken;
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
      console.log("Login...");
      console.log("credentials", Credentials);
      const response = await api.post("/auth/v1/login", Credentials);
      console.log("Login response:", response.data);

      if (response.data) {
        // const { token, roles, email, name, userId } = response.data;
        const { accessToken, token } = response.data;

        // Store accessToken (short-lived)
        Cookies.set("access_token", accessToken, {
          expires: 0.0105, // ~15 minutes = 15/1440  , 60*24
          secure: true,
          sameSite: "Lax",
        });

        // Store refresh token in cookies
        Cookies.set("refresh_token", token, {
          expires: 30, // usually longer than access token
          secure: true,
          sameSite: "Lax",
        });

        // set token in axios header for future request
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
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

    const token = Cookies.get("access_token");
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
    const token = Cookies.get("access_token");
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      console.log("isAuthenticated : ", exp * 1000 > Date.now());
      return exp * 1000 > Date.now(); // check if still valid
    } catch {
      return false;
    }
  },

  getCurrentUser: async () => {
    const isAuth = await authService.isAuthenticated();
    if (isAuth) {
      try {
        const response = await api.get("/auth/v1/current-user");
        return response.data;
      } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
      }
    }
    return null;
  },
};

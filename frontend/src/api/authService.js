import Cookies from "js-cookie";
import api from "./api";

const TOKEN_KEY = "token";

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
  getCurrentToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  // Remove token on logout
  logout: () => {
    Cookies.remove(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  },

  refreshToken: async () => {
    try {
      const token = Cookies.get(TOKEN_KEY);
      if (!token) throw new Error("No token available for refresh");

      const response = await api.get("/auth/v1/refreshToken", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newToken = response.data?.token;
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
      const response = await api.post("/auth/v1/login", Credentials);

      if (response.data) {
        const { token, roles, email, name, userId } = response.data;

        // store token in cookies
        Cookies.set(TOKEN_KEY, token, {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });

        // Store roles (as Json String)
        const user = { id: userId, name, email, roles };
        Cookies.set("user_data", JSON.stringify(user), {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });

        // set token in axios header for future request
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return response.data;
      }
    } catch (error) {
      // Optional: clear data on failed login attempt
      authService.logout();
      throw error;
    }
  },
};

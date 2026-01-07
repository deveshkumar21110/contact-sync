import { login } from "@/redux/authSlice";
import { fetchContacts } from "@/redux/contactSlice";
import { fetchLabels } from "@/redux/labelSlice";
import { fetchCurrentUser } from "@/redux/userSlice";
import { authService } from "@/Services/authService";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const code = params.get("code");

      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const tokenResponse = await authService.googleAuth(code); // exchange code with token
        authService.setToken(tokenResponse.accessToken,tokenResponse.token); // store tokens
        const userData = await authService.getCurrentUser();

        // Redux pipeline
        dispatch(login({userData}))
        dispatch(fetchCurrentUser(userData));
        dispatch(fetchContacts());
        dispatch(fetchLabels());

        navigate("/");

      } catch (error) {
        console.log("google login failed ", error);
        navigate("/login");
      }
    };
    handleGoogleLogin();
  }, []);

  return <div>Login...</div>;
}

export default GoogleCallback;

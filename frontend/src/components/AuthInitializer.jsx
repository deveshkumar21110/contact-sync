import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authService } from "../Services/authService";
import { login, logout } from "../redux/authSlice";
import { useState } from "react";
import { PulseLoader, ScaleLoader } from "react-spinners";
import { fetchContacts } from "../redux/contactSlice";
import { fetchCurrentUser } from "../redux/userSlice";
import { fetchLabels } from "../redux/labelSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated by verifying token
        const isAuthenticated = await authService.isAuthenticated();

        if (isAuthenticated) {
          // Get current user data
          const userData = await authService.getCurrentUser();
          if (userData) {
            // Set the token in axios headers for future requests
            const token = await authService.getCurrentToken();
            if (token) {
              // Update Redux state with correct payload structure
              dispatch(login({ userData }));
              // populate user slice and initial data
              dispatch(fetchCurrentUser(userData));
              dispatch(fetchContacts());
              dispatch(fetchLabels());
            } else {
              dispatch(logout());
            }
          } else {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        dispatch(logout());
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ScaleLoader color="black" size={8} margin={2} />{" "}
      </div>
    );
  }
  return children;
};

export default AuthInitializer;

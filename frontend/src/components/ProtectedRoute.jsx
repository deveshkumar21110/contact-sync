import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../Services/authService";
import { logout } from "../redux/authSlice";

const ProtectedRoute = ({ children, authentication = true }) => {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      // Wait a bit for Redux state to be initialized
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // Check if we have tokens in cookies
        const token = await authService.getCurrentToken();
        const isAuthenticated = await authService.isAuthenticated();
        
        setIsInitialized(true);
        
        if (authentication && !authStatus && (!token || !isAuthenticated)) {
          // If we have a refresh token, try to refresh first
          const refreshToken = authService.getRefreshToken();
          if (refreshToken) {
            try {
              await authService.refreshToken();
              // If refresh succeeds, we should be authenticated now
              setLoading(false);
              return;
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              dispatch(logout());
              navigate("/login");
              return;
            }
          } else {
            dispatch(logout());
            navigate("/login");
            return;
          }
        } else if (!authentication && authStatus !== authentication) {
          navigate("/");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        dispatch(logout());
        navigate("/login");
      }
    };

    checkAuth();
  }, [authStatus, navigate, authentication, dispatch]);

  // Show loading while checking authentication
  if (!isInitialized || loading) {
    // return <h1>Loading...</h1>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

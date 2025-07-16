import { Navigate } from "react-router-dom";
import { authService } from "../Services/authService";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await authService.isAuthenticated();
      setIsAuth(result);
    };
    checkAuth();
  }, []);

  console.log("Is Auth: " , isAuth, " ProtectedRoute");

  if (isAuth === null) {
    // Show a loading spinner or nothing while checking auth
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

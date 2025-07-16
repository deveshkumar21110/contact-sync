// App.js
import { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import { useDispatch } from "react-redux";
import { authService } from "./Services/authService";
import { login, logout } from "./redux/authSlice";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  // const [isAuth , setIsAuth] = useState(null);

  // useEffect(() => {
  //   const checkAuth = 
  // }, []);

  // if (loading) return null;

  return (
    <Router>
      <div className="w-full ">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage/>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

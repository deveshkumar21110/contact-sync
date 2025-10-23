import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../Services/authService";
import { login } from "../redux/authSlice";
import { fetchContacts } from "../redux/contactSlice";
import { fetchCurrentUser } from "../redux/userSlice";
import { fetchLabels } from "../redux/labelSlice";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.login({ email, password });
      // after login, fetch current user and data
      const userData = await authService.getCurrentUser();
      // update auth state with actual user data object expected by app
      dispatch(login({ userData }));
      // populate user slice and contacts/labels
      dispatch(fetchCurrentUser(userData));
      dispatch(fetchContacts());
      dispatch(fetchLabels());
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
      console.log("Error", err);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <button type="button" className="text-blue-600 underline" onClick={() => navigate("/signup")}>Sign up</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

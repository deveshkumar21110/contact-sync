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
      const userData = await authService.getCurrentUser();
      dispatch(login({ userData }));
      dispatch(fetchCurrentUser(userData));
      dispatch(fetchContacts());
      dispatch(fetchLabels());
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-800 rounded-md shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Login to ContactSync
          </h1>

          {error && (
            <div className="text-red-700 bg-gray-300 px-3 py-2 mb-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="text-sm text-gray-700">
              Username or email address
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 mb-4 block w-full rounded-md bg-transparent border border-gray-700 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Password</label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-gray-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 mb-4 block w-full rounded-md bg-transparent border border-gray-700 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium mb-4 disabled:opacity-60"
            >
              {loading ? "Login in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center text-sm text-gray-800 my-4">
            <div className="flex-1 h-px bg-gray-700" />
            <div className="px-3">or</div>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "http://localhost:8080/oauth/google/login";
              }}
              className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-md py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.64 12.205c0-.8-.072-1.568-.208-2.31H12v4.376h6.44c-.277 1.494-1.133 2.76-2.415 3.605v2.998h3.897c2.286-2.103 3.58-5.196 3.58-8.669z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24c3.24 0 5.958-1.07 7.944-2.906l-3.897-2.997c-1.082.726-2.467 1.156-4.047 1.156-3.106 0-5.74-2.096-6.686-4.913H1.27v3.086C3.24 21.803 7.36 24 12 24z"
                  fill="#34A853"
                />
                <path
                  d="M5.314 14.34a7.238 7.238 0 010-4.68V6.574H1.27a12 12 0 000 10.852l4.044-3.085z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.77c1.758 0 3.345.605 4.592 1.796l3.44-3.44C17.954 1.262 15.236 0 12 0 7.36 0 3.24 2.197 1.27 5.574l4.044 3.086C6.26 6.865 8.894 4.77 12 4.77z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-800">
            New to ContactSync?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

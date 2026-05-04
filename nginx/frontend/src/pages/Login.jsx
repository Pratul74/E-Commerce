import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("auth/login/", form);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      setIsAuth(true);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* Password Field with Toggle */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full rounded pr-10"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
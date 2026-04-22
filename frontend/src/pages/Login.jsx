import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("auth/login/", data);

      const payload = JSON.parse(atob(res.data.access.split(".")[1]));

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("role", payload.role);

      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input placeholder="Username" className="w-full mb-2 p-2 border"
          onChange={(e) => setData({...data, username: e.target.value})} />

        <input type="password" placeholder="Password" className="w-full mb-3 p-2 border"
          onChange={(e) => setData({...data, password: e.target.value})} />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
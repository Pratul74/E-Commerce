import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("auth/register/", data);
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded-xl shadow w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input placeholder="Username" className="w-full mb-2 p-2 border"
          onChange={(e) => setData({...data, username: e.target.value})} />

        <input placeholder="Email" className="w-full mb-2 p-2 border"
          onChange={(e) => setData({...data, email: e.target.value})} />

        <input type="password" placeholder="Password" className="w-full mb-3 p-2 border"
          onChange={(e) => setData({...data, password: e.target.value})} />

        <button className="w-full bg-black text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
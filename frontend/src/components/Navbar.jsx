import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-bold">🛒 MyStore</h1>

      <button onClick={logout} className="bg-black text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
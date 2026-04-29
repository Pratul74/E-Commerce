import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuth, setIsAuth] = useState(null); // 🔥 start as null

  // 🔥 Sync auth on load
  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuth(!!token);
  }, []);

  // ⏳ Prevent flicker / wrong redirect
  if (isAuth === null) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuth={setIsAuth} />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={
            isAuth
              ? <Dashboard setIsAuth={setIsAuth} />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// src/AdminLogin.js
import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthenticated(true);
      toast.success("Welcome Admin");
    } else {
      toast.error("Invalid password");
    }
  };

  if (authenticated) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white px-4">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Portal</h2>
        <input
          type="password"
          className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded-xl"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-xl transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

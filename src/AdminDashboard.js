// src/AdminDashboard.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin-auth");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl p-6">
        <p className="text-lg mb-2">
           <strong>Admin Actions:</strong>
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>View all recent sessions (coming soon)</li>
          <li>Manage users or ban suspicious identities (coming soon)</li>
          <li>Analyze trust scores via AI module (future module)</li>
        </ul>

        <div className="mt-8 text-center">
          <button
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white"
            onClick={() => {
              sessionStorage.removeItem("admin-auth");
              navigate("/admin");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Team Spark. All rights reserved.
      </footer>
    </div>
  );
}

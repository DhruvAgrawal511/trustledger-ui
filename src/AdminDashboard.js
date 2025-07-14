// src/AdminDashboard.js
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAdmin") === "true";
    if (!isAuth) {
      navigate("/admin");
    }
  }, [navigate]);

  const data = [
    { name: "User A", trustScore: 85 },
    { name: "User B", trustScore: 55 },
    { name: "User C", trustScore: 30 },
  ];

  const getStatus = (score) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-500";
  };

  const getLabel = (score) => {
    if (score >= 70) return "Approved ✅";
    if (score >= 50) return "Needs Review ⚠️";
    return "Rejected ❌";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Admin Portal - Session Reviews</h2>
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-left text-sm text-gray-400 uppercase">
              <th className="p-4">User</th>
              <th className="p-4">Trust Score</th>
              <th className="p-4">Decision</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, idx) => (
              <tr key={idx} className="border-t border-gray-800 text-sm">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.trustScore}</td>
                <td className={`p-4 font-semibold ${getStatus(user.trustScore)}`}>{getLabel(user.trustScore)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-10 text-sm text-gray-500">© 2025 Team Spark</div>
      </div>
    </div>
  );
};

export default AdminDashboard;

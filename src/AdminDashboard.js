// src/AdminDashboard.js
import { useEffect, useState } from "react";
import { fetchSession } from "./contractUtils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [pseudonymID, setPseudonymID] = useState("");
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAdmin") === "true";
    if (!isAuth) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleFetch = async () => {
    try {
      toast.loading("Fetching session...");
      const result = await fetchSession(pseudonymID);
      toast.dismiss();
      setSession(result);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to fetch session");
      console.error(err);
    }
  };

  const getStatusColor = (score) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-500";
  };

  const getStatusLabel = (score) => {
    if (score >= 70) return "Approved ✅";
    if (score >= 50) return "Needs Review ⚠️";
    return "Rejected ❌";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Admin Portal - Session Lookup</h2>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            className="bg-gray-800 border border-gray-700 p-3 flex-1 rounded-xl text-sm"
            placeholder="Enter Pseudonym ID (≤ 31 chars)"
            value={pseudonymID}
            onChange={(e) => setPseudonymID(e.target.value)}
          />
          <button
            onClick={handleFetch}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-sm"
          >
            Fetch Session
          </button>
        </div>

        {session ? (
          <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-800 text-left text-gray-400 uppercase">
                <th className="p-4">Pseudonym</th>
                <th className="p-4">Session Hash</th>
                <th className="p-4">Trust Score</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-800">
                <td className="p-4">{pseudonymID}</td>
                <td className="p-4">{session.sessionHash}</td>
                <td className="p-4">{session.trustScore}</td>
                <td className="p-4">{session.timestamp}</td>
                <td className={`p-4 font-semibold ${getStatusColor(session.trustScore)}`}>
                  {getStatusLabel(session.trustScore)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 mt-10">No session fetched yet.</p>
        )}

        <div className="text-center mt-10 text-sm text-gray-500">© 2025 Team Spark</div>
      </div>
    </div>
  );
};

export default AdminDashboard;

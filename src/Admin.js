// src/Admin.js
import { useState } from "react";
import { fetchSession } from "./contractUtils";
import toast from "react-hot-toast";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

export default function Admin() {
  const [pseudonymID, setPseudonymID] = useState("");
  const [session, setSession] = useState(null);

  const handleFetch = async () => {
    try {
      toast.loading("Fetching session...");
      const data = await fetchSession(pseudonymID);
      toast.dismiss();
      setSession(data);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to fetch session");
      console.error(err);
    }
  };

  const getStatus = (score) => {
    if (score >= 60) {
      return (
        <span className="flex items-center gap-2 text-green-400">
          <FaCheckCircle className="text-xl" /> Approved
        </span>
      );
    } else if (score >= 30) {
      return (
        <span className="flex items-center gap-2 text-yellow-400">
          <FaExclamationTriangle className="text-xl" /> Needs Review
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-2 text-red-500">
          <FaTimesCircle className="text-xl" /> Rejected
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-10 font-sans">
      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Portal</h1>

        <input
          className="bg-gray-800 border border-gray-700 p-3 w-full mb-4 rounded-xl text-sm"
          type="text"
          placeholder="Pseudonym ID (32-byte hex)"
          value={pseudonymID}
          onChange={(e) => setPseudonymID(e.target.value)}
        />

        <button
          onClick={handleFetch}
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 text-white rounded-xl mb-4"
        >
          View Session
        </button>

        {session && (
          <div className="bg-gray-800 p-4 rounded-xl text-sm">
            <p><strong>Session Hash:</strong> {session.sessionHash}</p>
            <p><strong>Trust Score:</strong> {session.trustScore}</p>
            <p><strong>Timestamp:</strong> {session.timestamp}</p>
            <p><strong>Status:</strong> {getStatus(session.trustScore)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

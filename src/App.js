import { useEffect, useState } from "react";
import { logSession, fetchSession, signMessage } from "./contractUtils";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import SessionGate from "./SessionGate";
import TrustBadge from "./TrustBadge";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./Admin";

export default function App() {
  const [pseudonymID, setPseudonymID] = useState("");
  const [sessionHash, setSessionHash] = useState("");
  const [trustScore, setTrustScore] = useState("");
  const [fetched, setFetched] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } else {
        toast.error("MetaMask not found");
      }
    }
    connectWallet();
  }, []);

  const handleLog = async () => {
    if (!pseudonymID || !sessionHash || !trustScore) return toast.error("Fill all fields");
    try {
      const message = `SessionHash:${sessionHash}::Score:${trustScore}`;
      const signature = await signMessage(message);
      const recovered = ethers.verifyMessage(message, signature);

      if (recovered.toLowerCase() !== account.toLowerCase()) {
        toast.error("Signature verification failed");
        return;
      }

      toast.loading("Logging session...");
      await logSession(pseudonymID, sessionHash, trustScore);
      toast.dismiss();
      toast.success("Session logged successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to log session");
      console.error(err);
    }
  };

  const handleFetch = async () => {
    try {
      const result = await fetchSession(pseudonymID);
      setFetched(result);
    } catch (err) {
      toast.error("Failed to fetch session");
      console.error(err);
    }
  };

  return (
    <Router>
      <Toaster position="top-center" />
      <nav className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">TrustLedger</h1>
        </div>
        <Link to="/admin" className="text-sm bg-white text-gray-900 px-3 py-1 rounded hover:bg-gray-200">Admin</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-950 text-white p-6">
              <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl">
                {account && (
                  <p className="text-green-400 text-sm mb-4 text-center">
                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                )}

                <input
                  className="bg-gray-800 border border-gray-700 p-3 w-full mb-4 rounded-xl text-sm"
                  type="text"
                  placeholder="Pseudonym ID (32-byte hex)"
                  value={pseudonymID}
                  onChange={(e) => setPseudonymID(e.target.value)}
                />
                <input
                  className="bg-gray-800 border border-gray-700 p-3 w-full mb-4 rounded-xl text-sm"
                  type="text"
                  placeholder="Session Hash (32-byte hex)"
                  value={sessionHash}
                  onChange={(e) => setSessionHash(e.target.value)}
                />
                <input
                  className="bg-gray-800 border border-gray-700 p-3 w-full mb-6 rounded-xl text-sm"
                  type="number"
                  placeholder="Trust Score (0 - 100)"
                  value={trustScore}
                  onChange={(e) => setTrustScore(e.target.value)}
                />

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleLog}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 text-white rounded-xl transition"
                  >
                    Log Session
                  </button>
                  <button
                    onClick={handleFetch}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-xl transition"
                  >
                    Fetch Session
                  </button>
                </div>

                {fetched && (
                  <>
                    <div className="mt-6 bg-gray-800 p-4 rounded-xl text-sm">
                      <p><strong>Session Hash:</strong> {fetched.sessionHash}</p>
                      <p><strong>Trust Score:</strong> {fetched.trustScore}</p>
                      <p><strong>Timestamp:</strong> {fetched.timestamp}</p>
                    </div>
                    <SessionGate trustScore={fetched.trustScore} />
                    <TrustBadge trustScore={fetched.trustScore} />
                  </>
                )}
              </div>
            </div>
          }
        />

        <Route path="/admin" element={<Admin />} />
      </Routes>

      <footer className="text-center text-gray-400 text-sm py-4 bg-gray-900 mt-4">
        © 2025 Team Spark. All Rights Reserved.
      </footer>
    </Router>
  );
}

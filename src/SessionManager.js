import { useEffect, useState } from "react";
import { logSession, fetchSession, signMessage } from "./contractUtils";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import SessionGate from "./SessionGate";
import TrustBadge from "./TrustBadge";

export default function SessionManager() {
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
    if (!pseudonymID || !sessionHash || !trustScore)
      return toast.error("Fill all fields");

    if (pseudonymID.length > 31 || sessionHash.length > 31) {
      toast.error("Pseudonym ID and Session Hash must be ≤ 31 characters.");
      return;
    }

    try {
      const message = `SessionHash:${sessionHash}::Score:${trustScore}`;
      const signature = await signMessage(message);
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== account.toLowerCase()) {
        toast.error("Signature verification failed!");
        return;
      } else {
        toast.success("Signature verified ");
      }

      toast.loading("Logging session...");
      await logSession(ethers.encodeBytes32String(pseudonymID),
         ethers.encodeBytes32String(sessionHash),
            trustScore
);

      toast.dismiss();
      toast.success("Session logged successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to log session");
      console.error(err);
    }
  };

  useEffect(() => {
  if (pseudonymID) {
    const encoded = ethers.encodeBytes32String(pseudonymID);
    console.log("Encoded pseudonym:", encoded);
  }
}, [pseudonymID]);


  const handleFetch = async () => {
    try {
      const result = await fetchSession(ethers.encodeBytes32String(pseudonymID));
      setFetched(result);
    } catch (err) {
      toast.error("Failed to fetch session");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-10 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">TrustLedger Session Manager</h1>
        {account && (
          <p className="text-green-400 text-sm mb-4 text-center">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}

        <input
          className="bg-gray-800 border border-gray-700 p-3 w-full mb-4 rounded-xl text-sm"
          type="text"
          placeholder="Pseudonym ID (≤ 31 characters)"
          value={pseudonymID}
          onChange={(e) => setPseudonymID(e.target.value)}
        />

        <input
          className="bg-gray-800 border border-gray-700 p-3 w-full mb-4 rounded-xl text-sm"
          type="text"
          placeholder="Session Hash (≤ 31 characters)"
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
            <div className="mt-8 bg-gray-800 p-4 rounded-xl text-sm">
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
  );
}

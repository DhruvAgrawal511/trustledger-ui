import { useState } from "react";
import { fetchSession } from "./contractUtils";
import { Toaster, toast } from "react-hot-toast";

export default function SessionGate() {
  const [pseudonymID, setPseudonymID] = useState("");
  const [result, setResult] = useState(null);

  const handleAuthorize = async () => {
    if (!pseudonymID) return toast.error("Enter a Pseudonym ID");
    try {
      toast.loading("Verifying trust score...");
      const data = await fetchSession(pseudonymID);
      toast.dismiss();

      setResult(data);
      const score = data.trustScore;

      if (score >= 70) toast.success("✅ Access Granted (Trusted)");
      else if (score >= 40) toast("⚠️ Access With Caution", { icon: "⚠️" });
      else toast.error("❌ Access Denied (Low Trust)");

    } catch (err) {
      toast.dismiss();
      toast.error("Failed to fetch session");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 p-6 mt-10 rounded-2xl shadow-lg">
      <Toaster position="top-center" />
      <h2 className="text-xl font-semibold mb-4 text-white text-center">Session Authorization</h2>

      <input
        className="bg-gray-800 border border-gray-700 p-3 w-full mb-4 rounded-xl text-sm"
        type="text"
        placeholder="Enter Pseudonym ID (hex)"
        value={pseudonymID}
        onChange={(e) => setPseudonymID(e.target.value)}
      />

      <button
        onClick={handleAuthorize}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 text-white rounded-xl w-full transition"
      >
        Authorize Session
      </button>

      {result && (
        <div className="mt-6 bg-gray-800 p-4 rounded-xl text-sm">
          <p><strong>Session Hash:</strong> {result.sessionHash}</p>
          <p><strong>Trust Score:</strong> {result.trustScore}</p>
          <p><strong>Timestamp:</strong> {result.timestamp}</p>
        </div>
      )}
    </div>
  );
}

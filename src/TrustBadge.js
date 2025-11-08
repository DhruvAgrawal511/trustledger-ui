// src/TrustBadge.js
import React from "react";

export default function TrustBadge({ trustScore }) {
  let badgeColor = "gray";
  let badgeLabel = "Unknown";

  if (trustScore >= 80) {
    badgeColor = "green";
    badgeLabel = "Trusted";
  } else if (trustScore >= 50) {
    badgeColor = "yellow";
    badgeLabel = "Caution";
  } else if (trustScore > 0) {
    badgeColor = "red";
    badgeLabel = "Untrusted";
  }

  return (
    <div className={`mt-4 p-2 rounded-xl text-center text-white bg-${badgeColor}-600`}>
      TrustBadge: <strong>{badgeLabel}</strong>
    </div>
  );
}

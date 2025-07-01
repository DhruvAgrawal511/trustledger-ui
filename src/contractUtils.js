import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "pseudonymID", type: "bytes32" },
      { internalType: "bytes32", name: "sessionHash", type: "bytes32" },
      { internalType: "uint256", name: "trustScore", type: "uint256" },
    ],
    name: "logSession",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "pseudonymID", type: "bytes32" }],
    name: "getSession",
    outputs: [
      { internalType: "bytes32", name: "", type: "bytes32" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const logSession = async (pseudonymID, sessionHash, trustScore) => {
  const contract = await getContract();
  const tx = await contract.logSession(pseudonymID, sessionHash, trustScore);
  await tx.wait();
  return tx;
};

export const fetchSession = async (pseudonymID) => {
  const contract = await getContract();
  const session = await contract.getSession(pseudonymID);
  return {
    sessionHash: session[0],
    trustScore: Number(session[1]),
    timestamp: new Date(Number(session[2]) * 1000).toLocaleString(),
  };
};

export const signMessage = async (message) => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);
  return signature;
};

export const verifySignature = async (message, signature, expectedAddress) => {
  const recovered = ethers.verifyMessage(message, signature);
  return recovered.toLowerCase() === expectedAddress.toLowerCase();
};

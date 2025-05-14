import { useState } from "react";
import { ethers } from "ethers";
import "./index.css";
import SupplyChain from "./contracts/SupplyChain.json"; // ⬅ Make sure you have this ABI file

const contractAddress = "0xYourContractAddressHere"; // ⬅ Replace with your deployed contract address

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        alert("Wallet connection rejected.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const addShipment = async () => {
    if (!shipmentId || !description) {
      alert("Please enter both Shipment ID and Description.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);
      const tx = await contract.addShipment(shipmentId, description);
      await tx.wait();
      alert("Shipment added successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed.");
    }
  };

  const getShipmentStatus = async () => {
    if (!shipmentId) {
      alert("Please enter a Shipment ID.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, SupplyChain.abi, provider);
      const result = await contract.getShipmentStatus(shipmentId);
      setStatus(result);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50 p-4 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-700">Supply Chain DApp</h1>

        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          {walletAddress
            ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect MetaMask"}
        </button>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Shipment ID"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={addShipment}
            className="flex-1 bg-green-500 text-white font-semibold py-2 rounded hover:bg-green-600"
          >
            Add Shipment
          </button>
          <button
            onClick={getShipmentStatus}
            className="flex-1 bg-purple-500 text-white font-semibold py-2 rounded hover:bg-purple-600"
          >
            Check Status
          </button>
        </div>

        {status && (
          <div className="bg-gray-50 border border-gray-300 rounded p-4 mt-2">
            <p className="text-lg font-medium text-center">
              📦 Shipment Status: <span className="text-blue-700">{status}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

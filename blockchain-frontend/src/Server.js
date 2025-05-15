const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const ContractJson = require("C:/Users/16692/Projects/Blockchain-For-Supply-Chain/Blockchain-For-Supply-Chain-1/blockchain-frontend/src/Contracts/TrackShipment.json"); // ✅ Adjust if renamed

const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Replace this
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // Hardhat localhost
const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractJson.abi, provider);

// 🔹 Fetch product
app.get("/product/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await contract.products(id);
    res.json({
      id,
      inventory: product.Inventory_Level.toString(),
      status: product.Shipment_Status,
    });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Product not found or fetch failed" });
  }
});

// 🔹 Ping
app.get("/", (_, res) => {
  res.send("Supply Chain API running.");
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrackShipment", function () {
  let trackShipment;

  beforeEach(async function () {
    const TrackShipment = await ethers.getContractFactory("TrackShipment");
    trackShipment = await TrackShipment.deploy();
  });

  it("should add a product correctly", async function () {
    await trackShipment.addProduct(1, 100, "Manufactured");

    const product = await trackShipment.products(1);
    expect(product.ID).to.equal(1);
    expect(product.Inventory_Level).to.equal(100);
    expect(product.Shipment_Status).to.equal("Manufactured");
  });

  it("should add a transaction to a product", async function () {
    const [owner, addr1] = await ethers.getSigners();

    await trackShipment.addProduct(1, 100, "Manufactured");

    await trackShipment.addTransaction(
      1, // productID
      50, // User_Transaction_Amount
      false, // Logistics_Delay
      "", // Logistics_Delay_Reason
      "Warehouse A", // location
      "Shipped", // Shipment_Status
      "ASSET123", // Asset_ID
      addr1.address // receiver
    );

    const transactions = await trackShipment.getTransactions(1);
    expect(transactions.length).to.equal(1);
    expect(transactions[0].User_Transaction_Amount).to.equal(50);
    expect(transactions[0].location).to.equal("Warehouse A");
    expect(transactions[0].Shipment_Status).to.equal("Shipped");
    expect(transactions[0].Asset_ID).to.equal("ASSET123");
    expect(transactions[0].receiver).to.equal(addr1.address);
  });
});

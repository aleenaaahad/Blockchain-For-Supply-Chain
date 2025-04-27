// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20; //the version of solidity compiler will use 

import "hardhat/console.sol"; //console to see smart contract outputs 

contract TrackShipment {
    struct Product {
        uint ID;
        uint Inventory_Level;
        string Shipment_Status; 

    }
    struct Transaction {
        uint User_Transaction_Amount;
        bool Logistics_Delay;
        string Logistics_Delay_Reason;
        uint Timestamp;
        address sender;
        address receiver; 
        string location;  
        string Shipment_Status;
        string Asset_ID; 

    }

mapping(uint => Product) public products;

mapping(uint => Transaction[]) public productTransactions;

function addProduct(uint _ID, uint _Inventory_Level, string memory _Shipment_Status) public {
    products[_ID] = Product(_ID, _Inventory_Level, _Shipment_Status);
}
function addTransaction(
    uint _productID,
    uint _User_Transaction_Amount,
    bool _Logistics_Delay,
    string memory _Logistics_Delay_Reason,
    string memory _location,
    string memory _Shipment_Status,
    string memory _Asset_ID,
    address _receiver
) public {
    Transaction memory newTransaction = Transaction({
        User_Transaction_Amount: _User_Transaction_Amount,
        Logistics_Delay: _Logistics_Delay,
        Logistics_Delay_Reason: _Logistics_Delay_Reason,
        Timestamp: block.timestamp,
        sender: msg.sender,
        receiver: _receiver,
        location: _location,
        Shipment_Status: _Shipment_Status,
        Asset_ID: _Asset_ID
    });

    productTransactions[_productID].push(newTransaction);
}


}



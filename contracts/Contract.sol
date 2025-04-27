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


}



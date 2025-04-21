// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20; //the version of solidity compiler will use 

import "hardhat/console.sol"; //console to see smart contract outputs 

contract TrackShipment {
    struct Product {
        uint ID;
        uint Inventory_Level;

    }
    struct Transaction {
        uint User_Transaction_Amount;
        string Logistics_Delay_Reason;
        uint Timestamp;
    }
}



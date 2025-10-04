// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../contracts/MonadDominion.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying contracts with the account:", deployer);
        console.log("Account balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MonadDominion dominion = new MonadDominion();
        
        console.log("MonadDominion deployed to:", address(dominion));
        console.log("Deployment gas used:", gasleft());
        
        vm.stopBroadcast();
        
        // Verify deployment
        console.log("\n=== Deployment Summary ===");
        console.log("Contract Address:", address(dominion));
        console.log("Deployer:", deployer);
        console.log("Network: Monad Testnet");
        console.log("Chain ID: 10143");
        console.log("\nNext steps:");
        console.log("1. Update CONTRACT_ADDRESS in lib/config.ts");
        console.log("2. Verify contract on Sourcify");
        console.log("3. Test the frontend application");
    }
}

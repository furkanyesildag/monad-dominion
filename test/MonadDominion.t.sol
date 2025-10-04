// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import "../contracts/MonadDominion.sol";

contract MonadDominionTest is Test {
    MonadDominion public dominion;
    address public player1 = address(0x1);
    address public player2 = address(0x2);
    address public player3 = address(0x3);

    function setUp() public {
        dominion = new MonadDominion();
        
        // Fund players
        vm.deal(player1, 1 ether);
        vm.deal(player2, 1 ether);
        vm.deal(player3, 1 ether);
    }

    function testInitialFactions() public {
        // Test that factions are initialized correctly
        MonadDominion.FactionInfo memory faction1 = dominion.getFactionInfo(1);
        MonadDominion.FactionInfo memory faction2 = dominion.getFactionInfo(2);
        MonadDominion.FactionInfo memory faction3 = dominion.getFactionInfo(3);

        assertEq(faction1.name, "Crimson Legion");
        assertEq(faction2.name, "Azure Order");
        assertEq(faction3.name, "Emerald Circle");
        
        assertTrue(faction1.exists);
        assertTrue(faction2.exists);
        assertTrue(faction3.exists);
    }

    function testJoinFaction() public {
        vm.startPrank(player1);
        
        // Join faction 1
        dominion.joinFaction(1);
        assertEq(dominion.getPlayerFaction(player1), 1);
        
        vm.stopPrank();
    }

    function testClaimTerritory() public {
        vm.startPrank(player1);
        
        // Join faction first
        dominion.joinFaction(1);
        
        // Claim territory
        uint256 territoryId = 1;
        dominion.claimTerritory{value: 0.001 ether}(territoryId);
        
        assertEq(dominion.getTerritory(territoryId), 1);
        
        vm.stopPrank();
    }

    function testCannotClaimClaimedTerritory() public {
        vm.startPrank(player1);
        dominion.joinFaction(1);
        dominion.claimTerritory{value: 0.001 ether}(1);
        vm.stopPrank();

        vm.startPrank(player2);
        dominion.joinFaction(2);
        
        // Should fail to claim already claimed territory
        vm.expectRevert("Territory already claimed");
        dominion.claimTerritory{value: 0.001 ether}(1);
        
        vm.stopPrank();
    }

    function testInsufficientPayment() public {
        vm.startPrank(player1);
        dominion.joinFaction(1);
        
        vm.expectRevert("Insufficient payment");
        dominion.claimTerritory{value: 0.0001 ether}(1);
        
        vm.stopPrank();
    }

    function testMustJoinFactionFirst() public {
        vm.startPrank(player1);
        
        vm.expectRevert("Must join a faction first");
        dominion.claimTerritory{value: 0.001 ether}(1);
        
        vm.stopPrank();
    }

    function testFactionStats() public {
        vm.startPrank(player1);
        dominion.joinFaction(1);
        dominion.claimTerritory{value: 0.001 ether}(1);
        dominion.claimTerritory{value: 0.001 ether}(2);
        vm.stopPrank();

        vm.startPrank(player2);
        dominion.joinFaction(2);
        dominion.claimTerritory{value: 0.001 ether}(3);
        vm.stopPrank();

        uint256[3] memory stats = dominion.getFactionStats();
        assertEq(stats[0], 2); // Faction 1 has 2 territories
        assertEq(stats[1], 1); // Faction 2 has 1 territory
        assertEq(stats[2], 0); // Faction 3 has 0 territories
    }

    function testEvents() public {
        vm.startPrank(player1);
        dominion.joinFaction(1);
        
        // Test TerritoryClaimed event
        vm.expectEmit(true, true, false, true);
        emit MonadDominion.TerritoryClaimed(1, player1, 1);
        dominion.claimTerritory{value: 0.001 ether}(1);
        
        vm.stopPrank();
    }
}





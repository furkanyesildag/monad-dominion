// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";

contract MonadDominion {
    // Territory mapping: territoryId => factionId (0 = unclaimed)
    mapping(uint256 => uint256) public territories;
    
    // Player faction mapping: address => factionId
    mapping(address => uint256) public playerFactions;
    
    // Faction info mapping: factionId => FactionInfo
    mapping(uint256 => FactionInfo) public factions;
    
    // Game rounds and winners
    mapping(uint256 => GameRound) public gameRounds;
    mapping(address => uint256) public playerWins; // Player address => number of wins
    
    // Territory claim cost in wei
    uint256 public constant CLAIM_COST = 0.001 ether;
    
    // Game settings
    uint256 public constant GAME_DURATION = 120; // 2 minutes in seconds
    uint256 public currentRound = 1;
    uint256 public gameStartTime;
    bool public gameActive = false;
    
    // Pre-defined factions
    uint256 public constant TOTAL_FACTIONS = 3;
    
    // Events
    event TerritoryClaimed(uint256 indexed territoryId, address indexed player, uint256 factionId);
    event FactionJoined(address indexed player, uint256 factionId);
    event GameStarted(uint256 indexed roundNumber, uint256 startTime);
    event GameEnded(uint256 indexed roundNumber, uint256 winnerFaction, address[] winners);
    event WinnerNFTMinted(address indexed winner, uint256 indexed roundNumber);
    
    // Structs
    struct FactionInfo {
        string name;
        string symbol;
        uint256 totalTerritories;
        uint256 memberCount;
        bool exists;
    }
    
    struct GameRound {
        uint256 roundNumber;
        uint256 startTime;
        uint256 endTime;
        uint256 winnerFaction;
        address[] winners;
        bool ended;
    }
    
    // Modifiers
    modifier onlyValidFaction(uint256 factionId) {
        require(factionId > 0, "Invalid faction ID");
        require(factions[factionId].exists, "Faction does not exist");
        _;
    }
    
    modifier onlyUnclaimedTerritory(uint256 territoryId) {
        require(territories[territoryId] == 0, "Territory already claimed");
        _;
    }
    
    constructor() {
        // Create 3 pre-defined factions
        factions[1] = FactionInfo({
            name: "Crimson Warriors",
            symbol: "🔥",
            totalTerritories: 0,
            memberCount: 0,
            exists: true
        });
        
        factions[2] = FactionInfo({
            name: "Azure Guardians", 
            symbol: "🌊",
            totalTerritories: 0,
            memberCount: 0,
            exists: true
        });
        
        factions[3] = FactionInfo({
            name: "Emerald Legion",
            symbol: "🌿", 
            totalTerritories: 0,
            memberCount: 0,
            exists: true
        });
    }
    
    function startGame() external payable {
        require(msg.value >= CLAIM_COST, "Insufficient payment to start game");
        require(!gameActive, "Game already active");
        
        gameActive = true;
        gameStartTime = block.timestamp;
        
        // Reset all territories
        // Note: In production, you'd want to iterate through claimed territories
        // For demo, we'll handle this in frontend
        
        emit GameStarted(currentRound, gameStartTime);
    }
    
    function endGame() external {
        require(gameActive, "No active game");
        require(block.timestamp >= gameStartTime + GAME_DURATION, "Game still in progress");
        
        gameActive = false;
        
        // Calculate winner faction
        uint256[4] memory factionScores; // Index 0 unused, 1-3 for factions
        
        // Count territories for each faction
        // Note: In production, you'd iterate through all territories
        // For demo, we'll calculate this in frontend and call with results
        
        uint256 winnerFaction = 1; // Default winner
        uint256 maxScore = factionScores[1];
        
        for (uint256 i = 2; i <= TOTAL_FACTIONS; i++) {
            if (factionScores[i] > maxScore) {
                maxScore = factionScores[i];
                winnerFaction = i;
            }
        }
        
        // Store round results
        gameRounds[currentRound] = GameRound({
            roundNumber: currentRound,
            startTime: gameStartTime,
            endTime: block.timestamp,
            winnerFaction: winnerFaction,
            winners: new address[](0), // Will be populated when minting NFTs
            ended: true
        });
        
        emit GameEnded(currentRound, winnerFaction, new address[](0));
        currentRound++;
    }
    
    function mintWinnerNFT() external {
        require(!gameActive, "Game still active");
        require(currentRound > 1, "No completed rounds");
        
        uint256 lastRound = currentRound - 1;
        GameRound storage round = gameRounds[lastRound];
        require(round.ended, "Round not ended");
        require(playerFactions[msg.sender] == round.winnerFaction, "Not in winning faction");
        
        // Simple NFT minting simulation - increment win count
        playerWins[msg.sender]++;
        
        // Add to winners list
        round.winners.push(msg.sender);
        
        emit WinnerNFTMinted(msg.sender, lastRound);
    }
    
    function joinFaction(uint256 factionId) external onlyValidFaction(factionId) {
        require(playerFactions[msg.sender] == 0, "Player already in a faction");
        playerFactions[msg.sender] = factionId;
        factions[factionId].memberCount++;
        emit FactionJoined(msg.sender, factionId);
    }
    
    function claimTerritory(uint256 territoryId) external onlyUnclaimedTerritory(territoryId) {
        require(gameActive, "No active game");
        require(block.timestamp < gameStartTime + GAME_DURATION, "Game time expired");
        require(playerFactions[msg.sender] > 0, "Must join a faction first");
        
        uint256 factionId = playerFactions[msg.sender];
        territories[territoryId] = factionId;
        factions[factionId].totalTerritories++;
        
        emit TerritoryClaimed(territoryId, msg.sender, factionId);
    }
    
    function getTerritory(uint256 territoryId) external view returns (uint256) {
        return territories[territoryId];
    }
    
    function getPlayerFaction(address player) external view returns (uint256) {
        return playerFactions[player];
    }
    
    function getFactionInfo(uint256 factionId) external view returns (FactionInfo memory) {
        require(factions[factionId].exists, "Faction does not exist");
        return factions[factionId];
    }
    
    function getAllFactions() external view returns (uint256[] memory) {
        uint256[] memory factionIds = new uint256[](nextFactionId - 1);
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextFactionId; i++) {
            if (factions[i].exists) {
                factionIds[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = factionIds[i];
        }
        
        return result;
    }
    
    // Helper function to generate territory ID from coordinates
    function getTerritoryId(int256 x, int256 y) external pure returns (uint256) {
        // Convert coordinates to a unique territory ID
        // Using a simple hash-like function
        return uint256(keccak256(abi.encodePacked(x, y))) % (2**32);
    }
    
    // Withdraw function for contract owner (if needed)
    function withdraw() external {
        // This could be used for prize pools or development funds
        payable(msg.sender).transfer(address(this).balance);
    }
}



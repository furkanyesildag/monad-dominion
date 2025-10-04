# 🏰 Monad Dominion - Real-time Multiplayer Strategy Game

A fully on-chain, real-time strategy game built for the Monad blockchain. Players compete to control hexagonal territories in massive multiplayer battles.

## 🚀 Features

### 🎮 Real Multiplayer System
- **WebSocket-based real-time multiplayer**
- **4-player matchmaking** - waits for real players
- **Demo mode** for instant AI simulation
- **Real-time room updates** and player synchronization

### 🏆 Game Mechanics
- **Hexagonal Territory Control** - claim territories on a massive hex grid
- **4 Unique Factions** - Cmty, Eco, Dev, Xyz with distinct characteristics
- **Timed Battles** - 2-minute intense rounds
- **NFT Rewards** - winners earn exclusive NFTs
- **Streak System** - daily engagement rewards
- **Real-time Leaderboard** - track your wins and stats

### 🔗 Blockchain Integration
- **Monad Testnet** integration
- **MetaMask wallet** connection
- **On-chain transactions** for game actions
- **Smart contract** territory management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the WebSocket Server
```bash
npm run server
```
This starts the real multiplayer server on `ws://localhost:8080`

### 3. Start the Frontend (New Terminal)
```bash
npm run dev
```
This starts the Next.js app on `http://localhost:3000`

### 4. Alternative: Start Both Together
```bash
npm run dev:full
```
This runs both server and frontend concurrently.

## 🎯 How to Play

### 1. Connect Wallet
- Click "Connect Wallet" and connect your MetaMask
- Make sure you're on Monad Testnet

### 2. Set Username
- Click "Set" next to the username field
- Enter a unique username (3+ characters)

### 3. Choose Game Mode
- Click "🎯 Find Match"
- **Demo Mode**: Instant AI simulation (2-4 fake players)
- **Real Mode**: Wait for 4 real players to join

### 4. Select Faction
- Choose from 4 factions: Cmty 👥, Eco 🌱, Dev ⚡, Xyz 🚀
- Each faction has unique characteristics

### 5. Start Battle
- Wait for room to fill (Real Mode) or start immediately (Demo)
- Click "🚀 Start New Game" when ready
- Battle lasts 2 minutes

### 6. Claim Territories
- Click on hexagonal tiles to claim them for your faction
- Limited painting capacity based on your streak level
- Strategic positioning is key!

### 7. Win NFTs
- Faction with most territories wins
- Winners can mint exclusive NFT rewards
- Track your wins on the leaderboard

## 🔧 Technical Architecture

### Frontend Stack
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animations
- **Wagmi + RainbowKit** - Web3 integration

### Backend Stack
- **Node.js WebSocket Server** - Real multiplayer
- **Solidity Smart Contracts** - On-chain game logic
- **Foundry** - Smart contract development

### Blockchain
- **Monad Testnet** - High-performance blockchain
- **MetaMask** - Wallet integration
- **Smart Contracts** - Territory and faction management

## 🌐 WebSocket API

### Client → Server Messages
```javascript
// Join real multiplayer match
{
  type: 'JOIN_REAL_MATCH',
  data: { username: 'Player1', address: '0x123...' }
}

// Leave current room
{
  type: 'LEAVE_ROOM',
  data: {}
}

// Start game (when room is full)
{
  type: 'START_GAME',
  data: {}
}
```

### Server → Client Messages
```javascript
// Room joined successfully
{
  type: 'ROOM_JOINED',
  data: { roomId: 'REAL-ABC123', playerCount: 2, maxPlayers: 4, players: [...] }
}

// Room player count updated
{
  type: 'ROOM_UPDATED',
  data: { roomId: 'REAL-ABC123', playerCount: 3, maxPlayers: 4, players: [...] }
}

// Room is full and ready
{
  type: 'ROOM_READY',
  data: { roomId: 'REAL-ABC123', message: 'Room is full!' }
}
```

## 🎮 Game Flow

### Real Multiplayer Flow
1. **Player 1** clicks "Real Mode" → Creates new room → "1/4 players"
2. **Player 2** clicks "Real Mode" → Joins same room → "2/4 players"  
3. **Player 3** clicks "Real Mode" → Joins same room → "3/4 players"
4. **Player 4** clicks "Real Mode" → Joins same room → "🎉 Room Ready!"
5. **Any player** clicks "Start Game" → 2-minute battle begins
6. **All players** compete for territory control
7. **Winner** gets NFT minting opportunity

### Demo Flow
1. **Player** clicks "Demo Mode" → Instant room with AI players
2. **Player** clicks "Start Game" → Battle begins immediately
3. **Simulated competition** with AI opponents

## 🏆 Leaderboard System

- **Username-based tracking** - persistent across sessions
- **Win/Loss records** - comprehensive statistics  
- **NFT count** - total rewards earned
- **Win rate** - performance metrics
- **Real-time updates** - live leaderboard changes

## 🔐 Smart Contract Integration

### Monad Testnet Configuration
- **RPC URLs**: Multiple endpoints for reliability
- **Gas Settings**: Optimized for Monad's architecture
- **Transaction Management**: Robust error handling

### Contract Functions
- `claimTerritory(uint256 territoryId)` - Claim hex tile
- `startGame()` - Initialize new game round
- `mintWinnerNFT()` - Reward winners with NFTs

## 🚨 Troubleshooting

### WebSocket Connection Issues
- Make sure WebSocket server is running on port 8080
- Check firewall settings
- Try refreshing the page

### MetaMask Issues  
- Ensure you're on Monad Testnet
- Check sufficient MON balance for gas fees
- Try the "Fix Nonce" button for stuck transactions

### Game Not Starting
- Verify username is set (3+ characters)
- Ensure you've joined a room
- For Real Mode, wait for 4/4 players

## 📱 Browser Compatibility

- **Chrome/Chromium** - Recommended
- **Firefox** - Supported
- **Safari** - Supported (with WebSocket limitations)
- **Mobile browsers** - Limited support

## 🎯 Deployment

### Production WebSocket Server
```bash
# Set production WebSocket URL in lib/websocket-client.ts
const serverUrl = 'wss://your-domain.com'

# Deploy WebSocket server
node server/websocket-server.js
```

### Frontend Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Hackathon Ready!

This project is designed for hackathon demonstrations:
- **Live multiplayer** works out of the box
- **Real blockchain integration** with Monad testnet
- **Professional UI/UX** with animations and effects
- **Scalable architecture** for production deployment

Perfect for showcasing the power of Monad's parallel processing capabilities in a real-time gaming environment!

---

**Built with ❤️ for the Monad ecosystem**
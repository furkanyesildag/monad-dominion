# Monad Dominion - Deployment Guide

## Prerequisites

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Get MON testnet tokens from faucet:
- Visit: https://testnet.monad.xyz
- Connect your wallet and request testnet tokens

## Environment Setup

Create a `.env` file in the root directory:
```
PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
```

## Smart Contract Deployment

1. Compile the contract:
```bash
forge build
```

2. Deploy to Monad Testnet:
```bash
forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast --verify
```

3. Update contract address in `lib/config.ts`:
```typescript
export const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'
```

## Frontend Deployment

1. Build the Next.js application:
```bash
npm run build
```

2. Start the development server:
```bash
npm run dev
```

3. For production deployment, you can deploy to Vercel, Netlify, or any other hosting platform.

## Contract Verification

After deployment, verify the contract:
```bash
forge verify-contract \
  --rpc-url https://testnet-rpc.monad.xyz \
  --verifier sourcify \
  --verifier-url https://sourcify-api-monad.blockvision.org \
  YOUR_CONTRACT_ADDRESS \
  contracts/MonadDominion.sol:MonadDominion
```

## Game Features

- **3 Factions**: Crimson Legion 🔥, Azure Order 🌊, Emerald Circle 🌿
- **Territory Claiming**: Pay 0.001 MON to claim unclaimed territories
- **Real-time Updates**: Live feed of territory claims
- **Faction Statistics**: Track each faction's territory count
- **Hexagonal Grid**: Visual representation of the game world

## How to Play

1. Connect your wallet to Monad Testnet
2. Join one of the three factions
3. Click on unclaimed territories (gray hexagons) to claim them
4. Watch the live battle feed for real-time updates
5. Compete to control the most territories!

## Technical Details

- **Network**: Monad Testnet (Chain ID: 10143)
- **Native Token**: MON
- **Claim Cost**: 0.001 MON per territory
- **Grid Size**: 20x15 hexagonal tiles (300 total territories)
- **Real-time**: Event-driven updates using wagmi hooks





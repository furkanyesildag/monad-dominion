import { createPublicClient, http, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

// Monad Testnet configuration - Official settings
export const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    secondary: {
      http: ['https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6'],
    },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://testnet.monadscan.com' },
    monadexplorer: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
    socialscan: { name: 'SocialScan', url: 'https://monad-testnet.socialscan.io' },
  },
  testnet: true,
} as const

// Monad Testnet Official Contract Addresses
export const MONAD_CONTRACTS = {
  Multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  UniswapV2Factory: '0x733e88f248b742db6c14c0b1713af5ad7fdd59d0',
  UniswapV2Router02: '0xfb8e1c3b833f9e67a71c859a132cf783b645e436',
  UniswapV3Factory: '0x961235a9020b05c44df1026d956d1f4d78014276',
  UniversalRouter: '0x3aE6D8A282D67893e17AA70ebFFb33EE5aa65893',
  WrappedMonad: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  USDC: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
  USDT: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D',
  WBTC: '0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d',
  WETH: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
  CreateX: '0xba5Ed099633D3B313e4D5F7bdc1305d3c28ba5Ed',
  Permit2: '0x000000000022d473030f116ddee9f6b43ac78ba3'
} as const

// Use CreateX for game start transactions (real contract)
export const CONTRACT_ADDRESS = MONAD_CONTRACTS.CreateX

// Use WrappedMonad for NFT claim transactions (real contract)
export const NFT_CONTRACT_ADDRESS = MONAD_CONTRACTS.WrappedMonad
export const CLAIM_COST = parseEther('0.001') // 0.001 MON

// Contract ABI
export const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string", "name": "symbol", "type": "string"}],
    "name": "createFaction",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "territoryId", "type": "uint256"}],
    "name": "claimTerritory",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "factionId", "type": "uint256"}],
    "name": "joinFaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "territoryId", "type": "uint256"}],
    "name": "getTerritory",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "player", "type": "address"}],
    "name": "getPlayerFaction",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "factionId", "type": "uint256"}],
    "name": "getFactionInfo",
    "outputs": [{"components": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string", "name": "symbol", "type": "string"}, {"internalType": "address", "name": "creator", "type": "address"}, {"internalType": "uint256", "name": "totalTerritories", "type": "uint256"}, {"internalType": "uint256", "name": "memberCount", "type": "uint256"}, {"internalType": "bool", "name": "exists", "type": "bool"}], "internalType": "struct MonadDominion.FactionInfo", "name": "", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllFactions",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "FACTION_COST",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CLAIM_COST",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "territoryId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "factionId", "type": "uint256"}
    ],
    "name": "TerritoryClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "player", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "factionId", "type": "uint256"}
    ],
    "name": "FactionJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "factionId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "symbol", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"}
    ],
    "name": "FactionCreated",
    "type": "event"
  }
] as const

// Faction configurations
export const FACTIONS = [
  {
    id: 1,
    name: 'Crimson Warriors',
    symbol: '🔥',
    description: 'Warriors of fire and blood. They seek dominance through strength and conquest.',
    color: '#FF4444',
  },
  {
    id: 2,
    name: 'Azure Guardians',
    symbol: '🌊',
    description: 'Guardians of the deep blue. They protect ancient wisdom and maintain balance.',
    color: '#4444FF',
  },
  {
    id: 3,
    name: 'Emerald Legion',
    symbol: '🌿',
    description: 'Masters of nature and growth. They believe in harmony and natural expansion.',
    color: '#44FF44',
  },
] as const

// Helper functions
export function getTerritoryId(x: number, y: number): number {
  // Simple hash function to convert coordinates to territory ID
  return Math.abs(x * 1000 + y) % (2**32)
}

export function getFactionColor(factionId: number): string {
  const faction = FACTIONS.find(f => f.id === factionId)
  return faction?.color || '#333333'
}

export function getFactionInfo(factionId: number) {
  return FACTIONS.find(f => f.id === factionId)
}



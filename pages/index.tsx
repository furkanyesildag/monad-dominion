import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import HexGrid from '../components/HexGrid'
import FactionSelector from '../components/FactionSelector'
import GameTimer from '../components/GameTimer'
import GameStats from '../components/GameStats'
import LiveFeed from '../components/LiveFeed'
import StreakSystem, { StreakData } from '../components/StreakSystem'
import { useTerritoryUpdates } from '../hooks/useTerritoryUpdates'
import { CONTRACT_ADDRESS, CONTRACT_ABI, FACTIONS, NFT_CONTRACT_ADDRESS } from '../lib/config'
import { sendMonadTransaction, checkBalance, isOnMonadTestnet, switchToMonadTestnet, clearStuckTransactions } from '../lib/transaction-utils'
import { updatePlayerStats } from './leaderboard'
import { getMultiplayerClient, MultiplayerClient, RoomData } from '../lib/websocket-client'


const Container = styled.div`
  height: 100vh;
  background: transparent;
  color: #FBFAF9;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`

const Header = styled.header`
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(251, 250, 249, 0.08); /* Monad Kirli Beyaz - subtle */
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(251, 250, 249, 0.15);
  box-shadow: 
    0 4px 24px rgba(32, 0, 82, 0.2), /* Monad Mavisi shadow */
    inset 0 1px 0 rgba(251, 250, 249, 0.1);
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`

const LeaderboardButton = styled(motion.div)`
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border: none;
  border-radius: 8px;
  color: #000;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }
`

const ClearNonceButton = styled(motion.button)`
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const RoomContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const RoomTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #4ECDC4;
`

const RoomButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

const RoomButton = styled(motion.button)`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
`

const RoomInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  margin-right: 1rem;
  width: 150px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const CurrentRoomDisplay = styled.div`
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: black;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
`

const UsernameContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`

const UsernameTitle = styled.h3`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #FFD700;
`

const UsernameInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`

const UsernameInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 0.5rem;
  font-size: 0.9rem;
  width: 150px;
  text-align: center;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const UsernameDisplay = styled.div`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const Title = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2rem;
  font-weight: 800; /* Inter Extra Bold */
  color: #FBFAF9; /* Monad Kirli Beyaz */
  text-shadow: 
    0 0 24px rgba(131, 110, 249, 0.6), /* Monad Moru glow */
    0 2px 8px rgba(32, 0, 82, 0.4); /* Monad Mavisi depth */
  margin: 0;
  letter-spacing: -0.02em; /* Inter optimal spacing */
  line-height: 1.1;
`


const GameArea = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr 220px;
  gap: 0.75rem;
  padding: 0.75rem;
  flex: 1;
  overflow: hidden;
`

const MapContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background: rgba(251, 250, 249, 0.04); /* Monad Kirli Beyaz - very subtle */
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 250, 249, 0.08);
  box-shadow: 
    0 4px 20px rgba(32, 0, 82, 0.1), /* Monad Mavisi shadow */
    inset 0 1px 0 rgba(251, 250, 249, 0.05);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
`

const LeftSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  overflow: hidden;
`

const RightSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  overflow: hidden;
`

export default function Home() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [selectedFaction, setSelectedFaction] = useState<number>(0)
  const [gameActive, setGameActive] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [isStartingGame, setIsStartingGame] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [streakData, setStreakData] = useState<StreakData>({
    minuteStreak: 0,
    gamesPlayedToday: 0,
    maxGamesPerDay: 6,
    paintingCapacity: 1,
    lastStreakTime: ''
  })
  const [territoriesPaintedThisGame, setTerritoriesPaintedThisGame] = useState(0)
  const [isClearingNonce, setIsClearingNonce] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [currentRoom, setCurrentRoom] = useState('')
  const [showRoomInput, setShowRoomInput] = useState(false)
  const [username, setUsername] = useState('')
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const [showMatchmakingModal, setShowMatchmakingModal] = useState(false)
  const [gameMode, setGameMode] = useState<'demo' | 'real'>('demo')
  const [realRoomPlayers, setRealRoomPlayers] = useState<string[]>([])
  const [isSearchingReal, setIsSearchingReal] = useState(false)
  const [multiplayerClient, setMultiplayerClient] = useState<MultiplayerClient | null>(null)
  const [wsConnected, setWsConnected] = useState(false)
  
  // Pre-defined factions
  const availableFactions = [
    { id: 1, name: 'Cmty', symbol: '👥', memberCount: 0, totalTerritories: 0 },
    { id: 2, name: 'Eco', symbol: '🌱', memberCount: 0, totalTerritories: 0 },
    { id: 3, name: 'Dev', symbol: '⚡', memberCount: 0, totalTerritories: 0 },
    { id: 4, name: 'Xyz', symbol: '🚀', memberCount: 0, totalTerritories: 0 }
  ]
  
  // Game territories - reset each round
  const [territories, setTerritories] = useState<Map<number, number>>(new Map())

  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize WebSocket client after mount
  useEffect(() => {
    if (!mounted) return
    
    // Initialize WebSocket client
    const client = getMultiplayerClient()
    setMultiplayerClient(client)
    
    // Set up event handlers
    client.onConnectionStatusChanged = (connected: boolean) => {
      setWsConnected(connected)
      console.log('🔌 WebSocket connection status:', connected)
    }
    
    client.onRoomJoined = (data: RoomData) => {
      console.log('🎉 Room joined:', data)
      setCurrentRoom(data.roomId)
      setRealRoomPlayers(data.players.map(p => p.username))
      setIsSearchingReal(false)
      
      // Show success toast
      const toast = document.createElement('div')
      toast.innerHTML = `🎯 Joined real room: ${data.roomId} (${data.playerCount}/${data.maxPlayers})`
      toast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: linear-gradient(45deg, #4CAF50, #45a049); 
        color: white; padding: 1rem; border-radius: 8px; 
        z-index: 1000; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 3000)
    }
    
    client.onRoomUpdated = (data: RoomData) => {
      console.log('🔄 Room updated:', data)
      setRealRoomPlayers(data.players.map(p => p.username))
      
      // Update search toast if searching
      const existingToast = document.querySelector('.search-toast')
      if (existingToast) {
        existingToast.innerHTML = `🔍 Found ${data.playerCount}/4 real players...`
      }
    }
    
    client.onRoomReady = (data: { roomId: string; message: string }) => {
      console.log('🎉 Room ready:', data)
      setIsSearchingReal(false)
      
      // Remove search toast
      const searchToast = document.querySelector('.search-toast')
      if (searchToast) {
        document.body.removeChild(searchToast)
      }
      
      // Show room ready toast
      const readyToast = document.createElement('div')
      readyToast.innerHTML = `🎉 Room Ready! 4/4 real players found`
      readyToast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: linear-gradient(45deg, #4CAF50, #45a049); 
        color: white; padding: 1rem; border-radius: 8px; 
        z-index: 1000; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `
      document.body.appendChild(readyToast)
      setTimeout(() => document.body.removeChild(readyToast), 5000)
    }
    
    client.onJoinFailed = (data: { message: string }) => {
      console.error('❌ Join failed:', data)
      setIsSearchingReal(false)
      
      const failToast = document.createElement('div')
      failToast.innerHTML = `❌ Failed to join: ${data.message}`
      failToast.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: linear-gradient(45deg, #FF5722, #D32F2F); 
        color: white; padding: 1rem; border-radius: 8px; 
        z-index: 1000; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `
      document.body.appendChild(failToast)
      setTimeout(() => document.body.removeChild(failToast), 3000)
    }
    
    // Connect to WebSocket server
    client.connect().catch(console.error)
    
    // Cleanup on unmount
    return () => {
      client.disconnect()
      // Also cleanup any remaining popups
      const existingPopup = document.getElementById('winner-popup-backdrop')
      if (existingPopup) {
        document.body.removeChild(existingPopup)
      }
    }
  }, [mounted])

  // Real-time updates
  const { updates } = useTerritoryUpdates({
    onTerritoryUpdate: (update) => {
      setTerritories(prev => new Map(prev.set(update.territoryId, update.factionId)))
    }
  })
  

  // Get player's faction
  const { data: playerFaction } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPlayerFaction',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  // Get faction stats from contract (disabled for demo)
  const { data: contractFactionStats } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllFactions',
    watch: true,
    enabled: false, // Disabled for demo mode
  })

  // Simplified - no complex wagmi hooks needed for demo

  const handleTerritoryClick = async (territoryId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }
    
    if (!selectedFaction || selectedFaction === 0) {
      alert('Please join a faction first!')
      return
    }
    
    if (!gameActive) {
      alert('No active game! Start a new game first.')
      return
    }
    
    // Check painting capacity
    if (territoriesPaintedThisGame >= streakData.paintingCapacity) {
      alert(`🎨 Painting limit reached! You can only paint ${streakData.paintingCapacity} territories per game.`)
      return
    }
    
    // Check if territory is already claimed
    if (territories.has(territoryId)) {
      alert('Territory already claimed!')
      return
    }
    
    // Claim territory
    setTerritories(prev => {
      const newMap = new Map(prev)
      newMap.set(territoryId, selectedFaction)
      return newMap
    })
    
    // Increment painted count
    setTerritoriesPaintedThisGame(prev => prev + 1)
    
    // Show success toast with remaining capacity
    const remaining = streakData.paintingCapacity - territoriesPaintedThisGame - 1
    const toastDiv = document.createElement('div')
    toastDiv.innerHTML = `✅ Territory painted! ${remaining > 0 ? `${remaining} paints left` : 'Capacity reached!'}`
    toastDiv.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: linear-gradient(45deg, #4ECDC4, #44A08D); 
      color: white; padding: 1rem; border-radius: 8px; 
      z-index: 1000; font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `
    document.body.appendChild(toastDiv)
    setTimeout(() => document.body.removeChild(toastDiv), 3000)
  }

  const handleFactionSelect = (factionId: number) => {
    setSelectedFaction(factionId)
    
    // Show faction joined message
    const faction = availableFactions.find(f => f.id === factionId)
    if (faction) {
      const toastDiv = document.createElement('div')
      toastDiv.innerHTML = `🎉 Joined ${faction.symbol} ${faction.name}!`
      toastDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: linear-gradient(45deg, #FFD700, #FFA500); 
        color: black; padding: 1rem; border-radius: 8px; 
        z-index: 1000; font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `
      document.body.appendChild(toastDiv)
      setTimeout(() => document.body.removeChild(toastDiv), 3000)
    }
  }

  const handleStartGame = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    if (!username) {
      alert('❌ Please set your username first!')
      setShowUsernameInput(true)
      return
    }
    
    if (!currentRoom) {
      alert('❌ Please join a room first!')
      return
    }
    
    if (gameMode === 'real' && realRoomPlayers.length < 4) {
      alert(`❌ Real mode requires 4 players!\n\nCurrent players: ${realRoomPlayers.length}/4\nWaiting for more players to join...`)
      return
    }

    // Check daily game limit
    if (streakData.gamesPlayedToday >= streakData.maxGamesPerDay) {
      alert(`🚫 Daily limit reached! You've played ${streakData.gamesPlayedToday}/${streakData.maxGamesPerDay} games today. Come back tomorrow!`)
      return
    }

    setIsStartingGame(true)
    
    // Check if user is on Monad Testnet
    const onMonad = await isOnMonadTestnet()
    if (!onMonad) {
      const switched = await switchToMonadTestnet()
      if (!switched) {
        alert('❌ Please switch to Monad Testnet to play the game.\n\nNetwork: Monad Testnet\nChain ID: 10143\nRPC: https://testnet-rpc.monad.xyz')
        setIsStartingGame(false)
        return
      }
    }
    
    // Check balance before transaction (0.001 MON + high gas fees ~0.015 MON)
    const hasBalance = await checkBalance(address!, '0x38D7EA4C68000') // 0.016 MON buffer for high gas (same as fix nonce)
    if (!hasBalance) {
      alert('❌ Insufficient MON balance. You need at least 0.016 MON (0.001 + high gas fees).\n\nGet MON from the faucet: https://testnet.monad.xyz')
      setIsStartingGame(false)
      return
    }
    
    try {
      console.log('Starting game transaction - using EXACT fix nonce method...')
      
      // Get latest confirmed nonce (EXACTLY like fix nonce)
      const latestNonce = await window.ethereum.request({
        method: 'eth_getTransactionCount',
        params: [address, 'latest']
      })
      
      console.log('Using nonce:', parseInt(latestNonce, 16))
      
      // Send transaction with EXACT same method as fix nonce - USE SELF ADDRESS LIKE FIX NONCE!
      const result = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address!,
          to: address!, // SAME AS FIX NONCE - send to self!
          value: '0x38D7EA4C68000', // 0.001 MON (only difference from fix nonce)
          gas: '0x5208', // EXACT same gas as fix nonce (21000)
          gasPrice: '0x174876E800', // EXACT same gas price as fix nonce (100 gwei)
          nonce: latestNonce, // EXACT same nonce method as fix nonce
        }]
      })
      
      // Start game after successful transaction
      const startTime = Math.floor(Date.now() / 1000)
      console.log('🚀 Starting game with timestamp:', startTime)
      
      setGameActive(true)
      setGameStartTime(startTime) // Use seconds (Unix timestamp)
      setTerritories(new Map()) // Reset territories
      setTerritoriesPaintedThisGame(0) // Reset painting count
      
      console.log('Game state updated:', { gameActive: true, gameStartTime: startTime })
      
      // Increment games played (this will update streak)
      if ((window as any).incrementGamePlayed) {
        (window as any).incrementGamePlayed()
      }
      
      alert(`🚀 Game started! Transaction Hash: ${String(result).slice(0, 10)}...\n🎨 You can paint ${streakData.paintingCapacity} territories this game!`)
      
    } catch (error: any) {
      console.error('Error starting game:', error)
      if (error.code === 4001) {
        alert('❌ Transaction cancelled by user.')
      } else if (error.message?.includes('insufficient funds')) {
        alert('❌ Insufficient MON balance. You need at least 0.01 MON.\n\nGet MON from: https://testnet.monad.xyz')
      } else {
        alert('❌ Failed to start game: ' + (error.message || 'Unknown error'))
      }
    } finally {
      setIsStartingGame(false)
    }
  }

  const handleClearNonce = async () => {
    if (!address) return
    
    setIsClearingNonce(true)
    try {
      await clearStuckTransactions(address)
      alert('✅ Nonce cleared! You can now try transactions again.')
    } catch (error: any) {
      alert('❌ Failed to clear nonce: ' + error.message)
    } finally {
      setIsClearingNonce(false)
    }
  }

  const handleFindMatch = () => {
    if (!username) {
      alert('❌ Please set your username first!')
      setShowUsernameInput(true)
      return
    }
    setShowMatchmakingModal(true)
  }
  
  const handleDemoMatch = () => {
    setGameMode('demo')
    const randomRoomId = Math.floor(Math.random() * 1000) + 1
    setCurrentRoom(`DEMO-${randomRoomId}`)
    setShowMatchmakingModal(false)
    
    // Simulate 1-3 other players
    const playerCount = Math.floor(Math.random() * 3) + 2 // 2-4 players total
    alert(`🎮 Demo Match Found!\n\nRoom: DEMO-${randomRoomId}\nPlayers: ${playerCount}/4\nYour Username: ${username}\n\nGet ready to battle!`)
  }
  
  const handleRealMatch = () => {
    if (!multiplayerClient || !wsConnected) {
      alert('❌ WebSocket server not connected! Please try again in a moment.')
      return
    }
    
    setGameMode('real')
    setIsSearchingReal(true)
    setShowMatchmakingModal(false)
    
    // Show searching toast
    const searchToast = document.createElement('div')
    searchToast.className = 'search-toast'
    searchToast.innerHTML = `🔍 Searching for real players...`
    searchToast.style.cssText = `
      position: fixed; top: 20px; right: 20px; 
      background: linear-gradient(45deg, #FF9800, #F57C00); 
      color: white; padding: 1rem; border-radius: 8px; 
      z-index: 1000; font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `
    document.body.appendChild(searchToast)
    
    // Join real match via WebSocket
    const success = multiplayerClient.joinRealMatch(username, address!)
    if (!success) {
      setIsSearchingReal(false)
      document.body.removeChild(searchToast)
      alert('❌ Failed to send join request. Please try again.')
    }
    
    // Timeout after 60 seconds
    setTimeout(() => {
      if (isSearchingReal) {
        setIsSearchingReal(false)
        const existingToast = document.querySelector('.search-toast')
        if (existingToast) {
          document.body.removeChild(existingToast)
        }
        
        const failToast = document.createElement('div')
        failToast.innerHTML = `❌ Couldn't find 4 real players. Try again!`
        failToast.style.cssText = `
          position: fixed; top: 20px; right: 20px; 
          background: linear-gradient(45deg, #FF5722, #D32F2F); 
          color: white; padding: 1rem; border-radius: 8px; 
          z-index: 1000; font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `
        document.body.appendChild(failToast)
        setTimeout(() => document.body.removeChild(failToast), 3000)
      }
    }, 60000)
  }
  

  const handleLeaveRoom = () => {
    // Leave real room via WebSocket if in real mode
    if (gameMode === 'real' && multiplayerClient && wsConnected) {
      multiplayerClient.leaveRoom()
    }
    
    setCurrentRoom('')
    setRealRoomPlayers([])
    setIsSearchingReal(false)
    setGameMode('demo')
    alert('👋 Left multiplayer room. You\'re now in solo mode.')
  }

  const handleSetUsername = () => {
    if (username.trim().length >= 3) {
      setShowUsernameInput(false)
      alert(`✅ Username set: ${username.trim()}\n\nNow you can join a room and start playing!`)
    } else {
      alert('❌ Username must be at least 3 characters long!')
    }
  }

  // Auto-show username input when wallet connects
  useEffect(() => {
    if (isConnected && !username && !showUsernameInput) {
      setShowUsernameInput(true)
    }
  }, [isConnected, username, showUsernameInput])

  const handleGameEnd = async () => {
    console.log('🏁 GAME END FUNCTION CALLED!')
    console.log('🔥 HANDLE GAME END - START')
    alert('🚨 GAME END FUNCTION TRIGGERED!')
    
    // Force set game as inactive
    setGameActive(false)
    console.log('✅ Game set to inactive')
    
    // Calculate winner
    const factionScores = [0, 0, 0, 0] // Index 0 unused
    territories.forEach(factionId => {
      if (factionId > 0 && factionId <= 3) {
        factionScores[factionId]++
      }
    })
    
    console.log('📊 Faction scores:', factionScores)
    
    let winnerFaction = 1
    let maxScore = factionScores[1]
    for (let i = 2; i <= 3; i++) {
      if (factionScores[i] > maxScore) {
        maxScore = factionScores[i]
        winnerFaction = i
      }
    }
    
    const winner = availableFactions.find(f => f.id === winnerFaction)
    console.log('🏆 Winner determined:', { winnerFaction, maxScore, winner: winner?.name })
    
    // Update leaderboard for all players who participated
    if (username && address && selectedFaction > 0) {
      const playerFaction = availableFactions.find(f => f.id === selectedFaction)
      if (playerFaction) {
        const isPlayerWinner = selectedFaction === winnerFaction
        updatePlayerStats(
          username,
          address,
          playerFaction.name,
          playerFaction.symbol,
          isPlayerWinner
        )
        console.log('📊 Leaderboard updated:', { username, won: isPlayerWinner })
      }
    }
    
    // Check if current player is in winning team
    const isPlayerWinner = selectedFaction === winnerFaction
    console.log('🎯 Player winner check:', { selectedFaction, winnerFaction, isPlayerWinner })
    
    if (!isPlayerWinner) {
      console.log('😔 Player is not winner, showing loss message')
      alert(`😔 Game Over!\n\nWinner: ${winner?.symbol} ${winner?.name}\nScore: ${maxScore} territories\n\nYou were in ${availableFactions.find(f => f.id === selectedFaction)?.name}.\nBetter luck next time!`)
      return // Don't show NFT popup for losers
    }
    
    console.log('🎉 Player is winner! Showing NFT popup...')
    
    // Show winner announcement with NFT claim
    const handleClaimNFT = async () => {
      try {
        const result = await sendMonadTransaction({
          from: address!,
          to: NFT_CONTRACT_ADDRESS, // WrappedMonad contract on Monad testnet
          value: '0x0', // Free NFT mint
          data: '0x'
        })
        alert(`🏆 Winner NFT minted! Tx: ${String(result).slice(0, 10)}...`)
      } catch (error: any) {
        if (error.code !== 4001) {
          alert('❌ Failed to mint NFT: ' + error.message)
        }
      }
    }
    
    // Show winner NFT claim popup (only for winners)
    console.log('🎉 SHOWING WINNER NFT POPUP!')
    
    // Clean up any existing popups first
    const existingPopup = document.getElementById('winner-popup-backdrop')
    if (existingPopup) {
      document.body.removeChild(existingPopup)
    }
    
    // Create popup container with backdrop
    const popupBackdrop = document.createElement('div')
    popupBackdrop.id = 'winner-popup-backdrop'
    popupBackdrop.style.cssText = `
      position: fixed; 
      top: 0; left: 0; 
      width: 100%; height: 100%; 
      background: rgba(0, 0, 0, 0.8); 
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `
    
    const winnerDiv = document.createElement('div')
    winnerDiv.id = 'winner-popup-content'
    winnerDiv.innerHTML = `
      <div style="text-align: center;">
        🏆 CONGRATULATIONS! 🏆<br/>
        <strong style="color: #4ECDC4; font-size: 1.4em;">🎉 YOU WON! 🎉</strong><br/>
        <br/>
        Your Team: ${winner?.symbol} ${winner?.name}<br/>
        Final Score: ${maxScore} territories<br/>
        <br/>
        <button id="claimNFT" style="
          background: linear-gradient(45deg, #4ECDC4, #44A08D); 
          border: none; border-radius: 8px; 
          color: white; padding: 1rem 2rem; margin-top: 1rem; cursor: pointer;
          font-size: 1.1em; font-weight: bold;
        ">🏆 Claim Winner NFT</button>
        <br/>
        <button id="closePopup" style="
          background: #666; border: none; border-radius: 4px; 
          color: white; padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;
        ">Close</button>
      </div>
    `
    winnerDiv.style.cssText = `
      background: linear-gradient(45deg, #FFD700, #FFA500); 
      color: black; padding: 2rem; border-radius: 12px; 
      font-weight: 600; text-align: center;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      font-size: 1.2rem; line-height: 1.5;
      max-width: 400px;
      margin: 1rem;
    `
    
    popupBackdrop.appendChild(winnerDiv)
    console.log('📢 ADDING POPUP TO DOM!')
    document.body.appendChild(popupBackdrop)
    
    // Cleanup function
    const cleanupPopup = () => {
      console.log('🧹 Cleaning up winner popup')
      const existingBackdrop = document.getElementById('winner-popup-backdrop')
      if (existingBackdrop) {
        document.body.removeChild(existingBackdrop)
      }
    }
    
    // Add click handlers
    setTimeout(() => {
      const claimButton = document.getElementById('claimNFT')
      const closeButton = document.getElementById('closePopup')
      
      if (claimButton) {
        console.log('🔗 Adding NFT claim handler')
        claimButton.addEventListener('click', async () => {
          await handleClaimNFT()
          cleanupPopup()
        })
      } else {
        console.error('❌ Claim button not found!')
      }
      
      if (closeButton) {
        console.log('🔗 Adding close handler')
        closeButton.addEventListener('click', cleanupPopup)
      } else {
        console.error('❌ Close button not found!')
      }
      
      // Also allow clicking backdrop to close
      popupBackdrop.addEventListener('click', (e) => {
        if (e.target === popupBackdrop) {
          cleanupPopup()
        }
      })
    }, 100)
    
    // Auto-remove after 60 seconds
    setTimeout(() => {
      cleanupPopup()
    }, 60000)
  }

  // Calculate real-time stats from territories
  const calculateRealTimeStats = () => {
    const stats: { [key: number]: number } = {}
    
    territories.forEach((factionId) => {
      if (factionId > 0) {
        stats[factionId] = (stats[factionId] || 0) + 1
      }
    })
    
    return availableFactions.map(faction => stats[faction.id] || 0)
  }

  const realTimeFactionStats = calculateRealTimeStats()

  const handleStreakUpdate = (newStreakData: StreakData) => {
    setStreakData(newStreakData)
  }

  // Show loading until mounted to prevent hydration errors
  if (!mounted) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <Title>🏰 Monad Dominion</Title>
            <div style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🏆 Leaderboard
            </div>
          </HeaderLeft>
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            Loading...
          </div>
        </Header>
        
        <GameArea>
          <MapContainer>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              fontSize: '1.2rem',
              opacity: 0.6
            }}>
              🔄 Loading game...
            </div>
          </MapContainer>
          
          <LeftSidebar>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px', 
              padding: '1rem', 
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>🔄 Loading</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Initializing...</p>
            </div>
          </LeftSidebar>
          
          <RightSidebar>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px', 
              padding: '1rem', 
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>⚡ Ready</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Waiting for wallet...</p>
            </div>
          </RightSidebar>
        </GameArea>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>🏰 Monad Dominion</Title>
          <Link href="/leaderboard">
            <LeaderboardButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏆 Leaderboard
            </LeaderboardButton>
          </Link>
          
          {isConnected && (
            <ClearNonceButton
              onClick={handleClearNonce}
              disabled={isClearingNonce}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isClearingNonce ? '🔄 Clearing...' : '🔧 Fix Nonce'}
            </ClearNonceButton>
          )}
          
          {/* Username System in Header */}
          {isConnected && (
            <>
              {showUsernameInput ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: 'white',
                      padding: '0.4rem',
                      fontSize: '0.8rem',
                      width: '120px'
                    }}
                  />
                  <button
                    onClick={handleSetUsername}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', /* Green gradient */
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '700', /* Inter Bold */
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Set
                  </button>
                </div>
              ) : username ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    background: 'rgba(251, 250, 249, 0.1)', /* Monad Kirli Beyaz */
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(251, 250, 249, 0.2)',
                    color: '#FBFAF9', /* Monad Kirli Beyaz */
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500', /* Inter Medium */
                    boxShadow: '0 2px 12px rgba(32, 0, 82, 0.15)'
                  }}>
                    👤 {username}
                  </div>
                  <button
                    onClick={() => setShowUsernameInput(true)}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      background: 'rgba(14, 16, 15, 0.4)', /* Monad Siyahı */
                      border: '1px solid rgba(251, 250, 249, 0.2)',
                      borderRadius: '8px',
                      color: '#FBFAF9', /* Monad Kirli Beyaz */
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500', /* Inter Medium */
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Change
                  </button>
                </div>
              ) : null}
              
              {/* Matchmaking in Header */}
              {!currentRoom ? (
                <button
                  onClick={handleFindMatch}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', /* Blue gradient */
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '700', /* Inter Bold */
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(33, 150, 243, 0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🎯 Find Match
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    background: 'rgba(131, 110, 249, 0.15)', /* Monad Moru - subtle */
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(131, 110, 249, 0.3)',
                    color: '#FBFAF9', /* Monad Kirli Beyaz */
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500', /* Inter Medium */
                    boxShadow: '0 2px 12px rgba(131, 110, 249, 0.2)'
                  }}>
                    {gameMode === 'real' ? '👥' : '🏆'} {currentRoom}
                    {gameMode === 'real' && realRoomPlayers.length > 0 && (
                      <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>
                        {realRoomPlayers.length}/4 players
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLeaveRoom}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      background: 'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)', /* Red gradient */
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '700', /* Inter Bold */
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(255, 87, 34, 0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🚪 Leave
                  </button>
                </div>
              )}
            </>
          )}
        </HeaderLeft>
        <ConnectButton />
      </Header>
      
      <GameArea>
        <LeftSidebar>
          {!isConnected ? (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '8px', 
              padding: '1rem', 
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#FFD700' }}>🔗 Connect Wallet</h3>
              <p style={{ margin: 0, opacity: 0.8 }}>Connect to join the battle!</p>
            </div>
          ) : (
            <>
              {/* Only Daily Streak System */}
              <StreakSystem 
                playerAddress={address}
                onStreakUpdate={handleStreakUpdate}
              />
            </>
          )}
        </LeftSidebar>

        <MapContainer>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#FBFAF9',
            textShadow: '0 0 12px rgba(131, 110, 249, 0.4)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em'
          }}>
            🗺️ Battle Map • {Object.keys(territories).length} Territories Claimed
          </div>
          <HexGrid 
            territories={territories}
            onTerritoryClick={handleTerritoryClick}
            playerFaction={selectedFaction}
          />
        </MapContainer>
        
        <RightSidebar>
          {isConnected && (
            <>
              <GameTimer 
                gameActive={gameActive}
                gameStartTime={gameStartTime}
                onGameEnd={handleGameEnd}
                onStartGame={handleStartGame}
                isStartingGame={isStartingGame}
                gamesPlayedToday={streakData.gamesPlayedToday}
                maxGamesPerDay={streakData.maxGamesPerDay}
              />
              
              {selectedFaction === 0 ? (
                <FactionSelector 
                  factions={availableFactions}
                  selectedFaction={selectedFaction}
                  onFactionSelect={handleFactionSelect}
                />
              ) : (
                <>
                  <GameStats 
                    factionStats={realTimeFactionStats}
                    playerFaction={selectedFaction}
                    availableFactions={availableFactions}
                  />
                  
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '6px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontSize: '0.8rem'
                  }}>
                    🎨 <strong>{territoriesPaintedThisGame}/{streakData.paintingCapacity}</strong> painted
                  </div>
                  
                  <LiveFeed updates={updates} />
                </>
              )}
            </>
          )}
        </RightSidebar>
      </GameArea>
      
      {/* Matchmaking Modal */}
      {showMatchmakingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            background: 'rgba(251, 250, 249, 0.1)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(251, 250, 249, 0.2)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 32px rgba(32, 0, 82, 0.4)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#FBFAF9',
              marginBottom: '1rem',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              🎮 Choose Game Mode
            </h2>
            
            <p style={{
              color: 'rgba(251, 250, 249, 0.8)',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }}>
              Select how you want to play Monad Dominion
            </p>
            
            {/* WebSocket connection status */}
            <div style={{
              background: wsConnected ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 87, 34, 0.1)',
              border: wsConnected ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 87, 34, 0.3)',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.8rem',
              color: 'rgba(251, 250, 249, 0.8)'
            }}>
              {wsConnected ? '🟢' : '🔴'} <strong>WebSocket:</strong> {wsConnected ? 'Connected to real multiplayer server' : 'Connecting to server...'}
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <button
                onClick={handleDemoMatch}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  padding: '1.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(76, 175, 80, 0.4)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>DEMO MODE</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  Play with AI simulation<br/>
                  Instant matchmaking
                </div>
              </button>
              
              <button
                onClick={handleRealMatch}
                disabled={!wsConnected}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  background: wsConnected ? 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' : 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  padding: '1.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: wsConnected ? 'pointer' : 'not-allowed',
                  boxShadow: wsConnected ? '0 4px 16px rgba(255, 152, 0, 0.4)' : '0 4px 16px rgba(158, 158, 158, 0.4)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  opacity: wsConnected ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (wsConnected) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (wsConnected) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 152, 0, 0.4)'
                  }
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>REAL MODE</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  Play with real players<br/>
                  4-player matchmaking
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowMatchmakingModal(false)}
              style={{
                fontFamily: 'Inter, sans-serif',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'rgba(251, 250, 249, 0.8)',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Container>
  )
}

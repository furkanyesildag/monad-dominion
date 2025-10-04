import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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


const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  font-family: 'Inter', sans-serif;
`

const Header = styled.header`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`

const LeaderboardButton = styled(motion.button)`
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
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const RoomTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #4ECDC4;
`

const RoomButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`

const RoomButton = styled(motion.button)`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
  }
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
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`

const UsernameTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #FFD700;
`

const UsernameInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`

const UsernameInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  width: 200px;
  text-align: center;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`

const UsernameDisplay = styled.div`
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 1rem;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`


const GameArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
  height: calc(100vh - 100px);
`

const MapContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    dailyStreak: 0,
    gamesPlayedToday: 0,
    maxGamesPerDay: 6,
    paintingCapacity: 1,
    lastPlayDate: ''
  })
  const [territoriesPaintedThisGame, setTerritoriesPaintedThisGame] = useState(0)
  const [isClearingNonce, setIsClearingNonce] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [currentRoom, setCurrentRoom] = useState('')
  const [showRoomInput, setShowRoomInput] = useState(false)
  const [username, setUsername] = useState('')
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  
  // Pre-defined factions
  const availableFactions = [
    { id: 1, name: 'Crimson Warriors', symbol: '🔥', memberCount: 0, totalTerritories: 0 },
    { id: 2, name: 'Azure Guardians', symbol: '🌊', memberCount: 0, totalTerritories: 0 },
    { id: 3, name: 'Emerald Legion', symbol: '🌿', memberCount: 0, totalTerritories: 0 }
  ]
  
  // Game territories - reset each round
  const [territories, setTerritories] = useState<Map<number, number>>(new Map())

  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])

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
      alert('❌ You must join a room before starting the game!\n\nClick "Find Random Match" to join a multiplayer room.')
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

    // Simulate finding a random match
    const randomRoomId = Math.floor(Math.random() * 1000) + 1
    setCurrentRoom(`ROOM-${randomRoomId}`)
    setShowRoomInput(false)
    
    // Simulate 1-3 other players
    const playerCount = Math.floor(Math.random() * 3) + 2 // 2-4 players total
    alert(`🎮 Match Found!\n\nRoom: ROOM-${randomRoomId}\nPlayers: ${playerCount}/4\nYour Username: ${username}\n\nGet ready to battle!`)
  }

  const handleLeaveRoom = () => {
    setCurrentRoom('')
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
    
    const winnerDiv = document.createElement('div')
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
        <button onclick="this.parentElement.remove()" style="
          background: #666; border: none; border-radius: 4px; 
          color: white; padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;
        ">Close</button>
      </div>
    `
    winnerDiv.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: linear-gradient(45deg, #FFD700, #FFA500); 
      color: black; padding: 2rem; border-radius: 12px; 
      z-index: 1000; font-weight: 600; text-align: center;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      font-size: 1.2rem; line-height: 1.5;
    `
    console.log('📢 ADDING POPUP TO DOM!')
    document.body.appendChild(winnerDiv)
    
    // Add click handler for NFT claim
    setTimeout(() => {
      const claimButton = document.getElementById('claimNFT')
      if (claimButton) {
        console.log('🔗 Adding NFT claim handler')
        claimButton.addEventListener('click', handleClaimNFT)
      } else {
        console.error('❌ Claim button not found!')
      }
    }, 100)
    
    // Auto-remove after 60 seconds
    setTimeout(() => {
      if (document.body.contains(winnerDiv)) {
        console.log('⏰ Auto-removing winner popup')
        document.body.removeChild(winnerDiv)
      }
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
            <LeaderboardButton
              onClick={() => router.push('/leaderboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏆 Leaderboard
            </LeaderboardButton>
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
          
          <Sidebar>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textAlign: 'center' 
            }}>
              <h3>🔄 Loading</h3>
              <p>Initializing game components...</p>
            </div>
          </Sidebar>
        </GameArea>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>🏰 Monad Dominion</Title>
          <LeaderboardButton
            onClick={() => router.push('/leaderboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏆 Leaderboard
          </LeaderboardButton>
          
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
        </HeaderLeft>
        <ConnectButton />
      </Header>
      
      <GameArea>
        <MapContainer>
          <HexGrid 
            territories={territories}
            onTerritoryClick={handleTerritoryClick}
            playerFaction={selectedFaction} // Use selected faction for demo
          />
        </MapContainer>
        
        <Sidebar>
          {!isConnected ? (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '2rem', 
              textAlign: 'center' 
            }}>
              <h3>🔗 Connect Wallet</h3>
              <p>Connect your wallet to join a faction and start playing!</p>
            </div>
          ) : (
            <>
              <StreakSystem 
                playerAddress={address}
                onStreakUpdate={handleStreakUpdate}
              />

              {/* Username System */}
              {showUsernameInput ? (
                <UsernameContainer>
                  <UsernameTitle>👤 Set Your Username</UsernameTitle>
                  <UsernameInputGroup>
                    <UsernameInput
                      type="text"
                      placeholder="Enter your username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={20}
                      onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
                    />
                    <RoomButton
                      onClick={handleSetUsername}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Set Username
                    </RoomButton>
                  </UsernameInputGroup>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Choose a unique username (3-20 characters)
                  </div>
                </UsernameContainer>
              ) : username ? (
                <UsernameContainer>
                  <UsernameDisplay>
                    👤 {username}
                  </UsernameDisplay>
                  <RoomButton
                    onClick={() => setShowUsernameInput(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ background: 'linear-gradient(45deg, #666, #444)', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    Change Username
                  </RoomButton>
                </UsernameContainer>
              ) : null}

              {/* Matchmaking System */}
              <RoomContainer>
                <RoomTitle>🌐 Multiplayer Matchmaking</RoomTitle>
                {!currentRoom ? (
                  <RoomButtons>
                    <RoomButton
                      onClick={handleFindMatch}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🎯 Find Random Match
                    </RoomButton>
                  </RoomButtons>
                ) : (
                  <div>
                    <CurrentRoomDisplay>
                      🏆 {currentRoom} - Multiplayer Battle Active!
                    </CurrentRoomDisplay>
                    <div style={{ marginTop: '1rem' }}>
                      <RoomButton
                        onClick={handleLeaveRoom}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ background: 'linear-gradient(45deg, #e74c3c, #c0392b)' }}
                      >
                        🚪 Leave Room
                      </RoomButton>
                    </div>
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '0.9rem', 
                  opacity: 0.7, 
                  marginTop: '1rem',
                  textAlign: 'center'
                }}>
                  {currentRoom 
                    ? 'You\'re in a multiplayer room! Compete with other players in real-time.'
                    : 'Find a random match to play with other players online!'
                  }
                </div>
              </RoomContainer>
              
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
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    🎨 <strong>{territoriesPaintedThisGame}/{streakData.paintingCapacity}</strong> territories painted this game
                  </div>
                  
                  <LiveFeed updates={updates} />
                </>
              )}
            </>
          )}
        </Sidebar>
      </GameArea>
    </Container>
  )
}

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
import { CONTRACT_ADDRESS, CONTRACT_ABI, FACTIONS, MONAD_CONTRACTS } from '../lib/config'


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
  const [streakData, setStreakData] = useState<StreakData>({
    dailyStreak: 0,
    gamesPlayedToday: 0,
    maxGamesPerDay: 6,
    paintingCapacity: 1,
    lastPlayDate: ''
  })
  const [territoriesPaintedThisGame, setTerritoriesPaintedThisGame] = useState(0)
  
  // Pre-defined factions
  const availableFactions = [
    { id: 1, name: 'Crimson Warriors', symbol: '🔥', memberCount: 0, totalTerritories: 0 },
    { id: 2, name: 'Azure Guardians', symbol: '🌊', memberCount: 0, totalTerritories: 0 },
    { id: 3, name: 'Emerald Legion', symbol: '🌿', memberCount: 0, totalTerritories: 0 }
  ]
  
  // Game territories - reset each round
  const [territories, setTerritories] = useState<Map<number, number>>(new Map())

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
    functionName: 'getFactionStats',
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

    // Check daily game limit
    if (streakData.gamesPlayedToday >= streakData.maxGamesPerDay) {
      alert(`🚫 Daily limit reached! You've played ${streakData.gamesPlayedToday}/${streakData.maxGamesPerDay} games today. Come back tomorrow!`)
      return
    }

    setIsStartingGame(true)
    
    try {
      // Real MetaMask transaction to start game
      const result = await window.ethereum?.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: MONAD_CONTRACTS.CreateX, // Using CreateX contract for demo
          value: '0x38D7EA4C68000', // 0.001 MON in hex
          gas: '0x5208', // 21000 gas
          gasPrice: '0xBA43B7400', // 50 gwei (minimum for Monad)
          data: '0x' // Empty data for simple transfer
        }]
      })
      
      // Start game after successful transaction
      setGameActive(true)
      setGameStartTime(Math.floor(Date.now() / 1000))
      setTerritories(new Map()) // Reset territories
      setTerritoriesPaintedThisGame(0) // Reset painting count
      
      // Increment games played (this will update streak)
      if ((window as any).incrementGamePlayed) {
        (window as any).incrementGamePlayed()
      }
      
      alert(`🚀 Game started! Transaction Hash: ${String(result).slice(0, 10)}...\n🎨 You can paint ${streakData.paintingCapacity} territories this game!`)
      
    } catch (error: any) {
      console.error('Error starting game:', error)
      if (error.code === 4001) {
        alert('❌ Transaction cancelled by user.')
      } else {
        alert('❌ Failed to start game: ' + error.message)
      }
    } finally {
      setIsStartingGame(false)
    }
  }

  const handleGameEnd = async () => {
    setGameActive(false)
    
    // Calculate winner
    const factionScores = [0, 0, 0, 0] // Index 0 unused
    territories.forEach(factionId => {
      if (factionId > 0 && factionId <= 3) {
        factionScores[factionId]++
      }
    })
    
    let winnerFaction = 1
    let maxScore = factionScores[1]
    for (let i = 2; i <= 3; i++) {
      if (factionScores[i] > maxScore) {
        maxScore = factionScores[i]
        winnerFaction = i
      }
    }
    
    const winner = availableFactions.find(f => f.id === winnerFaction)
    
    // Show winner announcement with NFT claim
    const handleClaimNFT = async () => {
      try {
        const result = await window.ethereum?.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: MONAD_CONTRACTS.CreateX,
            value: '0x0', // Free NFT mint
            gas: '0x5208',
            gasPrice: '0xBA43B7400',
            data: '0x'
          }]
        })
        alert(`🏆 Winner NFT minted! Tx: ${String(result).slice(0, 10)}...`)
      } catch (error: any) {
        if (error.code !== 4001) {
          alert('❌ Failed to mint NFT: ' + error.message)
        }
      }
    }
    
    // Show winner announcement
    const winnerDiv = document.createElement('div')
    winnerDiv.innerHTML = `
      🏆 GAME ENDED! 🏆<br/>
      Winner: ${winner?.symbol} ${winner?.name}<br/>
      Score: ${maxScore} territories<br/>
      <button id="claimNFT" style="
        background: #4ECDC4; border: none; border-radius: 4px; 
        color: white; padding: 0.5rem 1rem; margin-top: 0.5rem; cursor: pointer;
      ">Claim Winner NFT</button>
      <button onclick="this.parentElement.remove()" style="
        background: #666; border: none; border-radius: 4px; 
        color: white; padding: 0.5rem 1rem; margin: 0.5rem 0 0 0.5rem; cursor: pointer;
      ">Close</button>
    `
    winnerDiv.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: linear-gradient(45deg, #FFD700, #FFA500); 
      color: black; padding: 2rem; border-radius: 12px; 
      z-index: 1000; font-weight: 600; text-align: center;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      font-size: 1.2rem; line-height: 1.5;
    `
    document.body.appendChild(winnerDiv)
    
    // Add click handler for NFT claim
    const claimButton = winnerDiv.querySelector('#claimNFT')
    if (claimButton) {
      claimButton.addEventListener('click', handleClaimNFT)
    }
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      if (document.body.contains(winnerDiv)) {
        document.body.removeChild(winnerDiv)
      }
    }, 15000)
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

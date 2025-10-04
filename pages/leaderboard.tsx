import { useRouter } from 'next/router'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #FFD700, #FFA500, #FFC107);
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

const BackButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`

const MainContent = styled.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
`

const LeaderboardTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
`

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`

const PlayerItem = styled(motion.div)<{ rank: number }>`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  ${props => props.rank === 1 && `
    background: linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.02) 100%);
    border-color: #FFD700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  `}
  ${props => props.rank === 2 && `
    background: linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.02) 100%);
    border-color: #C0C0C0;
    box-shadow: 0 0 15px rgba(192, 192, 192, 0.3);
  `}
  ${props => props.rank === 3 && `
    background: linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0.02) 100%);
    border-color: #CD7F32;
    box-shadow: 0 0 10px rgba(205, 127, 50, 0.2);
  `}
`

const RankBadge = styled.div<{ rank: number }>`
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 1.5rem;
  width: 40px;
  text-align: center;
  color: ${props => {
    switch (props.rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return 'rgba(255, 255, 255, 0.6)';
    }
  }};
  text-shadow: ${props => props.rank <= 3 ? `0 0 10px ${props.color}80` : 'none'};
`

const PlayerDetails = styled.div`
  flex-grow: 1;
`

const PlayerAddress = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FactionSymbol = styled.span`
  font-size: 1.5rem;
`

const PlayerInfo = styled.p`
  font-size: 0.85rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
`

const PlayerStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  text-align: center;
  min-width: 120px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #95E1D3;
  margin-bottom: 0.2rem;
`

const StatLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.6;
  text-transform: uppercase;
`

const NFTBadge = styled.div`
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: black;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
`

// Real leaderboard data structure
interface PlayerData {
  username: string
  address: string
  faction: string
  symbol: string
  winCount: number
  lastWin: string
  totalGames: number
  winRate: number
}

// Get leaderboard data from localStorage
const getLeaderboardData = (): PlayerData[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem('monad-leaderboard')
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Save leaderboard data to localStorage
const saveLeaderboardData = (data: PlayerData[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('monad-leaderboard', JSON.stringify(data))
}

// Add or update player data
export const updatePlayerStats = (
  username: string, 
  address: string, 
  faction: string, 
  symbol: string, 
  won: boolean
) => {
  const data = getLeaderboardData()
  const existingIndex = data.findIndex(p => p.username === username || p.address === address)
  
  if (existingIndex >= 0) {
    // Update existing player
    data[existingIndex].totalGames += 1
    if (won) {
      data[existingIndex].winCount += 1
      data[existingIndex].lastWin = `${Math.floor(Date.now() / 1000)} seconds ago`
    }
    data[existingIndex].winRate = (data[existingIndex].winCount / data[existingIndex].totalGames) * 100
    data[existingIndex].faction = faction // Update current faction
    data[existingIndex].symbol = symbol
  } else {
    // Add new player
    data.push({
      username,
      address,
      faction,
      symbol,
      winCount: won ? 1 : 0,
      lastWin: won ? `${Math.floor(Date.now() / 1000)} seconds ago` : 'Never',
      totalGames: 1,
      winRate: won ? 100 : 0
    })
  }
  
  saveLeaderboardData(data)
  return data
}

export default function Leaderboard() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [playerStats, setPlayerStats] = useState<PlayerData[]>([])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Load real leaderboard data
    const data = getLeaderboardData()
    setPlayerStats(data)
  }, [])
  
  // Refresh data every 10 seconds
  useEffect(() => {
    if (!mounted) return
    
    const interval = setInterval(() => {
      const data = getLeaderboardData()
      setPlayerStats(data)
    }, 10000)
    
    return () => clearInterval(interval)
  }, [mounted])

  // Show loading until mounted
  if (!mounted) {
    return (
      <Container>
        <Header>
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            ⬅️ Back to Game
          </div>
          <Title>🏆 NFT Winners Leaderboard</Title>
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            Loading...
          </div>
        </Header>

        <MainContent>
          <LeaderboardTitle>🏅 Top NFT Collectors</LeaderboardTitle>
          <div style={{ textAlign: 'center', opacity: 0.8, marginBottom: '2rem' }}>
            Loading leaderboard data...
          </div>
        </MainContent>
      </Container>
    )
  }
  
  // Create leaderboard data sorted by win count
  const leaderboardData = playerStats
    .sort((a, b) => b.winCount - a.winCount)
    .map((player, index) => ({
      ...player,
      rank: index + 1
    }))

  return (
    <Container>
      <Header>
        <BackButton
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅️ Back to Game
        </BackButton>
        <Title>🏆 NFT Winners Leaderboard</Title>
        <ConnectButton />
      </Header>

      <MainContent>
        <LeaderboardTitle>🏅 Top NFT Collectors</LeaderboardTitle>
        <div style={{ textAlign: 'center', opacity: 0.8, marginBottom: '2rem' }}>
          Players ranked by Winner NFTs earned from game victories
        </div>
        
        <PlayerList>
          {leaderboardData.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ marginBottom: '1rem', color: '#FFD700' }}>No Players Yet!</h3>
              <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
                Be the first to play and win NFTs! Connect your wallet, set a username, and start battling.
              </p>
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'black',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🎮 Start Playing
              </button>
            </div>
          ) : (
            leaderboardData.map((player) => (
            <PlayerItem key={player.address} rank={player.rank}>
              <RankBadge rank={player.rank}>{player.rank}</RankBadge>
              <PlayerDetails>
                <PlayerAddress>
                  <FactionSymbol>{player.symbol}</FactionSymbol> 
                  {player.username}
                  {player.winCount > 0 && <NFTBadge>🏆 {player.winCount} NFTs</NFTBadge>}
                </PlayerAddress>
                <PlayerInfo>
                  {player.faction} • {player.totalGames} games • {player.winRate.toFixed(1)}% win rate
                  <br />
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                    {player.address} • Last Win: {player.lastWin}
                  </span>
                </PlayerInfo>
              </PlayerDetails>
              <StatCard>
                <StatValue>{player.winCount}</StatValue>
                <StatLabel>Winner NFTs</StatLabel>
              </StatCard>
            </PlayerItem>
            ))
          )}
        </PlayerList>
        
        <div style={{ 
          textAlign: 'center', 
          opacity: 0.7, 
          fontSize: '0.9rem', 
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px'
        }}>
          🎮 Win games to earn exclusive Winner NFTs! Each victory in a 2-minute battle round rewards the winning faction members with unique NFTs.
          <br />
          Live Leaderboard
        </div>
      </MainContent>
    </Container>
  )
}
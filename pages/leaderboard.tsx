import { useRouter } from 'next/router'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

const Container = styled.div`
  min-height: 100vh;
  background: 
    repeating-linear-gradient(
      0deg,
      #0E100F 0px, #0E100F 4px,
      #1A1C1B 4px, #1A1C1B 8px
    ),
    repeating-linear-gradient(
      90deg,
      #0E100F 0px, #0E100F 4px,
      #1A1C1B 4px, #1A1C1B 8px
    ),
    radial-gradient(ellipse at center, #200052 0%, #0E100F 100%);
  background-size: 8px 8px, 8px 8px, 100% 100%;
  color: #FBFAF9;
  font-family: 'Press Start 2P', 'Inter', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 4px solid #836EF9;
  margin-bottom: 2rem;
  box-shadow: 0 4px 0 rgba(131, 110, 249, 0.3);
`

const Title = styled.h1`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 24px;
  font-weight: 400;
  color: #FBFAF9;
  text-shadow: 
    3px 3px 0 #836EF9,
    6px 6px 0 rgba(131, 110, 249, 0.5);
  letter-spacing: 2px;
  line-height: 1.6;
  image-rendering: pixelated;
  margin: 0;
`

const BackButton = styled(motion.button)`
  font-family: 'Press Start 2P', 'Inter', monospace;
  background: 
    repeating-linear-gradient(
      0deg,
      #836EF9 0px, #836EF9 2px,
      #9B8BF9 2px, #9B8BF9 4px
    );
  border: 4px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  color: #FBFAF9;
  font-weight: 400;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 20px;
  cursor: pointer;
  transition: none;
  position: relative;
  box-shadow: 
    inset 2px 2px 0 rgba(255, 255, 255, 0.3),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3),
    4px 4px 0 #200052;
  image-rendering: pixelated;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 
      inset 3px 3px 0 rgba(255, 255, 255, 0.4),
      inset -3px -3px 0 rgba(0, 0, 0, 0.4),
      2px 2px 0 #200052;
  }
  
  &:active {
    transform: translate(4px, 4px);
    box-shadow: 
      inset 4px 4px 0 rgba(0, 0, 0, 0.5),
      inset -4px -4px 0 rgba(255, 255, 255, 0.2),
      1px 1px 0 #200052;
  }
`

const MainContent = styled.div`
  width: 100%;
  max-width: 800px;
  background: 
    repeating-linear-gradient(
      45deg,
      #200052 0px, #200052 4px,
      #0E100F 4px, #0E100F 8px
    );
  border: 4px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  box-shadow: 
    inset 3px 3px 0 rgba(255, 255, 255, 0.2),
    inset -3px -3px 0 rgba(0, 0, 0, 0.4),
    6px 6px 0 rgba(131, 110, 249, 0.3);
  padding: 2rem;
  image-rendering: pixelated;
`

const LeaderboardTitle = styled.h2`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-bottom: 1rem;
  color: #FBFAF9;
  text-shadow: 
    2px 2px 0 #836EF9,
    4px 4px 0 rgba(131, 110, 249, 0.5);
  letter-spacing: 1px;
  line-height: 1.6;
  image-rendering: pixelated;
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
  background: 
    repeating-linear-gradient(
      45deg,
      rgba(14, 16, 15, 0.3) 0px, rgba(14, 16, 15, 0.3) 2px,
      rgba(32, 0, 82, 0.2) 2px, rgba(32, 0, 82, 0.2) 4px
    );
  border: 3px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  box-shadow: 
    inset 2px 2px 0 rgba(255, 255, 255, 0.2),
    inset -2px -2px 0 rgba(0, 0, 0, 0.3),
    4px 4px 0 rgba(131, 110, 249, 0.2);
  padding: 1rem 1.5rem;
  position: relative;
  overflow: hidden;
  image-rendering: pixelated;
  
  ${props => props.rank === 1 && `
    background: 
      repeating-linear-gradient(
        45deg,
        rgba(255, 215, 0, 0.2) 0px, rgba(255, 215, 0, 0.2) 2px,
        rgba(255, 165, 0, 0.1) 2px, rgba(255, 165, 0, 0.1) 4px
      );
    border-color: #FFD700 #FFA500 #FFA500 #FFD700;
    box-shadow: 
      inset 2px 2px 0 rgba(255, 255, 255, 0.3),
      inset -2px -2px 0 rgba(0, 0, 0, 0.3),
      4px 4px 0 rgba(255, 215, 0, 0.3);
  `}
  ${props => props.rank === 2 && `
    background: 
      repeating-linear-gradient(
        45deg,
        rgba(192, 192, 192, 0.2) 0px, rgba(192, 192, 192, 0.2) 2px,
        rgba(169, 169, 169, 0.1) 2px, rgba(169, 169, 169, 0.1) 4px
      );
    border-color: #C0C0C0 #A9A9A9 #A9A9A9 #C0C0C0;
  `}
  ${props => props.rank === 3 && `
    background: 
      repeating-linear-gradient(
        45deg,
        rgba(205, 127, 50, 0.2) 0px, rgba(205, 127, 50, 0.2) 2px,
        rgba(184, 115, 51, 0.1) 2px, rgba(184, 115, 51, 0.1) 4px
      );
    border-color: #CD7F32 #B87333 #B87333 #CD7F32;
  `}
`

const RankBadge = styled.div<{ rank: number }>`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 18px;
  font-weight: 400;
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
  text-shadow: ${props => props.rank <= 3 ? `2px 2px 0 rgba(0, 0, 0, 0.8)` : '1px 1px 0 rgba(0, 0, 0, 0.8)'};
  image-rendering: pixelated;
`

const PlayerDetails = styled.div`
  flex-grow: 1;
`

const PlayerAddress = styled.h3`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FBFAF9;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  image-rendering: pixelated;
`

const FactionSymbol = styled.span`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 16px;
  image-rendering: pixelated;
`

const PlayerInfo = styled.p`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 8px;
  font-weight: 400;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  color: #FBFAF9;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  image-rendering: pixelated;
  line-height: 1.6;
`

const PlayerStats = styled.div`
  display: flex;
  gap: 1rem;
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 8px;
  opacity: 0.9;
  image-rendering: pixelated;
`

const StatCard = styled.div`
  background: 
    repeating-linear-gradient(
      45deg,
      rgba(14, 16, 15, 0.4) 0px, rgba(14, 16, 15, 0.4) 2px,
      rgba(32, 0, 82, 0.3) 2px, rgba(32, 0, 82, 0.3) 4px
    );
  border: 2px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  box-shadow: 
    inset 1px 1px 0 rgba(255, 255, 255, 0.2),
    inset -1px -1px 0 rgba(0, 0, 0, 0.3),
    2px 2px 0 rgba(131, 110, 249, 0.2);
  padding: 0.8rem 1.2rem;
  text-align: center;
  min-width: 120px;
  image-rendering: pixelated;
`

const StatValue = styled.div`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 16px;
  font-weight: 400;
  color: #95E1D3;
  margin-bottom: 0.3rem;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
  image-rendering: pixelated;
`

const StatLabel = styled.div`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 8px;
  font-weight: 400;
  color: rgba(251, 250, 249, 0.8);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  image-rendering: pixelated;
  opacity: 0.6;
  text-transform: uppercase;
`

const NFTBadge = styled.div`
  background: 
    repeating-linear-gradient(
      45deg,
      #FFD700 0px, #FFD700 2px,
      #FFA500 2px, #FFA500 4px
    );
  color: #0E100F;
  padding: 0.3rem 0.8rem;
  border: 2px solid;
  border-color: #FFD700 #FFA500 #FFA500 #FFD700;
  box-shadow: 
    inset 1px 1px 0 rgba(255, 255, 255, 0.3),
    inset -1px -1px 0 rgba(0, 0, 0, 0.3),
    2px 2px 0 rgba(255, 165, 0, 0.3);
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 8px;
  font-weight: 400;
  margin-left: 0.5rem;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
  image-rendering: pixelated;
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
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GameStatsProps {
  factionStats: number[]
  playerFaction: number
  availableFactions: any[]
}

const Container = styled.div`
  font-family: 'Inter', sans-serif;
  background: rgba(251, 250, 249, 0.06); /* Monad Kirli Beyaz - subtle */
  backdrop-filter: blur(24px);
  border: 1px solid rgba(251, 250, 249, 0.12);
  box-shadow: 
    0 4px 24px rgba(32, 0, 82, 0.15), /* Monad Mavisi shadow */
    inset 0 1px 0 rgba(251, 250, 249, 0.08);
  border-radius: 8px;
  padding: 0.75rem;
`

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 700; /* Inter Bold */
  color: #FBFAF9; /* Monad Kirli Beyaz */
  text-shadow: 0 0 16px rgba(131, 110, 249, 0.4); /* Monad Moru glow */
  letter-spacing: -0.01em; /* Inter optimal spacing */
`

const StatItem = styled.div<{ faction: number; isPlayerFaction: boolean }>`
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
  margin-bottom: 0.3rem;
  border-radius: 6px;
  background: ${props => {
    if (props.isPlayerFaction) return 'rgba(131, 110, 249, 0.15)' /* Monad Moru highlight */
    return 'rgba(255, 255, 255, 0.05)'
  }};
  border: ${props => props.isPlayerFaction ? '1px solid rgba(131, 110, 249, 0.3)' : '1px solid rgba(251, 250, 249, 0.1)'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isPlayerFaction ? 'rgba(131, 110, 249, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
  }
`

const FactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`

const FactionColor = styled.div<{ faction: number }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => {
    switch (props.faction) {
      case 1: return '#836EF9' /* Cmty - Monad Moru */
      case 2: return '#A0055D' /* Eco - Monad Böğürtleni */
      case 3: return '#FBFAF9' /* Dev - Monad Kirli Beyaz */
      case 4: return '#0E100F' /* Xyz - Monad Siyahı */
      default: return '#666666'
    }
  }};
  border: 1px solid rgba(251, 250, 249, 0.3);
  box-shadow: 0 0 4px rgba(131, 110, 249, 0.2);
`

const FactionName = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 600; /* Inter SemiBold */
  font-size: 0.75rem;
  color: #FBFAF9; /* Monad Kirli Beyaz */
  letter-spacing: -0.01em;
`

const TerritoryCount = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700; /* Inter Bold */
  font-size: 0.875rem;
  color: #FBFAF9; /* Monad Kirli Beyaz */
  text-shadow: 0 0 8px rgba(131, 110, 249, 0.4);
`

const TotalTerritories = styled.div`
  font-family: 'Inter', sans-serif;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(251, 250, 249, 0.1);
  text-align: center;
  font-size: 0.65rem;
  font-weight: 400;
  color: rgba(251, 250, 249, 0.7);
  letter-spacing: -0.01em;
`

const factions = [
  { id: 1, name: 'Crimson Legion', icon: '🔥' },
  { id: 2, name: 'Azure Order', icon: '🌊' },
  { id: 3, name: 'Emerald Circle', icon: '🌿' }
]

export default function GameStats({ factionStats, playerFaction, availableFactions }: GameStatsProps) {
  const [mounted, setMounted] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('')
  
  const stats = factionStats || []
  const totalTerritories = stats.reduce((sum, count) => sum + Number(count), 0)

  useEffect(() => {
    setMounted(true)
    setLastUpdate(new Date().toLocaleTimeString())
  }, [])

  useEffect(() => {
    if (mounted) {
      setLastUpdate(new Date().toLocaleTimeString())
    }
  }, [factionStats, mounted])

  return (
    <Container>
      <Title>🏰 Live Battle Stats</Title>
      
      {availableFactions.map((faction, index) => {
        const count = stats[index] || 0
        const isPlayerFaction = playerFaction === faction.id
        const percentage = totalTerritories > 0 ? ((Number(count) / totalTerritories) * 100).toFixed(1) : '0'
        
        return (
          <StatItem key={faction.id} faction={faction.id} isPlayerFaction={isPlayerFaction}>
            <FactionInfo>
              <FactionColor faction={faction.id} />
              <div>
                <FactionName>{faction.symbol} {faction.name}</FactionName>
                <div style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.65rem', 
                  color: 'rgba(251, 250, 249, 0.6)', 
                  marginTop: '1px',
                  fontWeight: '400',
                  letterSpacing: '-0.01em'
                }}>
                  {percentage}% • {faction.memberCount || 1} members
                </div>
              </div>
            </FactionInfo>
            <TerritoryCount>{count.toString()}</TerritoryCount>
          </StatItem>
        )
      })}
      
      <TotalTerritories>
        Total: {totalTerritories} territories • {(300 - totalTerritories)} unclaimed
      </TotalTerritories>
      
      <div style={{ 
        fontFamily: 'Inter, sans-serif',
        marginTop: '0.5rem', 
        padding: '0.375rem', 
        background: 'rgba(131, 110, 249, 0.1)', 
        borderRadius: '6px',
        fontSize: '0.65rem',
        fontWeight: '400',
        color: 'rgba(251, 250, 249, 0.7)',
        textAlign: 'center',
        letterSpacing: '-0.01em'
      }}>
        🔄 Live {mounted && lastUpdate ? `• ${lastUpdate}` : '• Real-time'}
      </div>
    </Container>
  )
}



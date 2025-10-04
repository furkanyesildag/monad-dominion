import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GameStatsProps {
  factionStats: number[]
  playerFaction: number
  availableFactions: any[]
}

const Container = styled.div`
  font-family: 'Press Start 2P', 'Inter', monospace;
  background: 
    repeating-linear-gradient(
      45deg,
      #200052 0px, #200052 4px,
      #0E100F 4px, #0E100F 8px
    );
  backdrop-filter: blur(24px);
  border: 2px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  box-shadow: 
    inset 1px 1px 0 rgba(255, 255, 255, 0.2),
    inset -1px -1px 0 rgba(0, 0, 0, 0.4),
    3px 3px 0 rgba(131, 110, 249, 0.3);
  border-radius: 0;
  padding: 0.5rem;
  image-rendering: pixelated;
  min-height: 80px;
  width: 100%;
  max-width: 180px;
`

const Title = styled.h3`
  font-family: 'Press Start 2P', 'Inter', monospace;
  margin: 0 0 0.4rem 0;
  font-size: 8px;
  font-weight: 400;
  color: #FBFAF9;
  text-shadow: 
    1px 1px 0 #836EF9,
    2px 2px 0 rgba(131, 110, 249, 0.5);
  letter-spacing: 0.4px;
  image-rendering: pixelated;
  line-height: 1.1;
  text-align: center;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
  margin-bottom: 0.3rem;
`

const StatItem = styled.div<{ faction: number; isPlayerFaction: boolean }>`
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(251, 250, 249, 0.1);
  transition: all 0.2s ease;
  text-align: center;
  min-height: 40px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const FactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin-bottom: 0.15rem;
`

const FactionColor = styled.div<{ faction: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.faction) {
      case 1: return '#836EF9'
      case 2: return '#A0055D'
      case 3: return '#FBFAF9'
      case 4: return '#0E100F'
      default: return '#666666'
    }
  }};
  border: 1px solid rgba(251, 250, 249, 0.3);
  box-shadow: 0 0 2px rgba(131, 110, 249, 0.2);
`

const FactionName = styled.span`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-weight: 400;
  font-size: 6px;
  color: #FBFAF9;
  letter-spacing: 0.3px;
  image-rendering: pixelated;
  line-height: 1.1;
`

const TerritoryCount = styled.span`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-weight: 400;
  font-size: 10px;
  color: #FBFAF9;
  text-shadow: 
    1px 1px 0 #836EF9,
    2px 2px 0 rgba(131, 110, 249, 0.5);
  image-rendering: pixelated;
`

const FactionDetails = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 4px;
  color: rgba(251, 250, 249, 0.7);
  text-align: center;
  line-height: 1.1;
  margin-top: 0.1rem;
`

const TotalTerritories = styled.div`
  font-family: 'Press Start 2P', 'Inter', monospace;
  margin-top: 0.2rem;
  padding-top: 0.2rem;
  border-top: 1px solid rgba(251, 250, 249, 0.2);
  text-align: center;
  font-size: 4px;
  font-weight: 400;
  color: rgba(251, 250, 249, 0.8);
  letter-spacing: 0.3px;
  image-rendering: pixelated;
  line-height: 1.1;
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
      
      <StatsGrid>
        {availableFactions.map((faction, index) => {
          const count = stats[index] || 0
          const isPlayerFaction = playerFaction === faction.id
          const percentage = totalTerritories > 0 ? ((Number(count) / totalTerritories) * 100).toFixed(1) : '0'
          
          return (
            <StatItem key={faction.id} faction={faction.id} isPlayerFaction={isPlayerFaction}>
              <FactionInfo>
                <FactionColor faction={faction.id} />
                <FactionName>{faction.symbol} {faction.name}</FactionName>
              </FactionInfo>
              <TerritoryCount>{count.toString()}</TerritoryCount>
              <FactionDetails>
                {percentage}% • {faction.memberCount || 1} members
              </FactionDetails>
            </StatItem>
          )
        })}
      </StatsGrid>
      
      <TotalTerritories>
        Total: {totalTerritories} territories • {(300 - totalTerritories)} unclaimed
      </TotalTerritories>
      
      <div style={{ 
        fontFamily: 'Inter, sans-serif',
        marginTop: '0.15rem', 
        padding: '0.15rem', 
        background: 'rgba(131, 110, 249, 0.1)', 
        borderRadius: '2px',
        fontSize: '4px',
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



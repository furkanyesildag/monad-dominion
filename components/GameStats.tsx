import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GameStatsProps {
  factionStats: number[]
  playerFaction: number
  availableFactions: any[]
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`

const StatItem = styled.div<{ faction: number; isPlayerFaction: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: ${props => {
    if (props.isPlayerFaction) return 'rgba(255, 215, 0, 0.1)'
    return 'rgba(255, 255, 255, 0.05)'
  }};
  border: ${props => props.isPlayerFaction ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent'};
`

const FactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FactionColor = styled.div<{ faction: number }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.faction) {
      case 1: return '#FF4444'
      case 2: return '#4444FF'
      case 3: return '#44FF44'
      default: return '#666666'
    }
  }};
`

const FactionName = styled.span`
  font-weight: 500;
`

const TerritoryCount = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`

const TotalTerritories = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
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
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>
                  {percentage}% of map • {faction.memberCount || 1} members
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
        marginTop: '1rem', 
        padding: '0.5rem', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '6px',
        fontSize: '0.8rem',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        🔄 Updates every claim {mounted && lastUpdate ? `• Last: ${lastUpdate}` : '• Live stats'}
      </div>
    </Container>
  )
}



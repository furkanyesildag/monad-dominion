import styled from 'styled-components'
import { motion } from 'framer-motion'

interface FactionSelectorProps {
  factions: any[]
  selectedFaction: number
  onFactionSelect: (factionId: number) => void
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

const FactionCard = styled(motion.div)<{ faction: number; isSelected: boolean; isPlayerFaction: boolean }>`
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => {
    if (props.isPlayerFaction) return '#FFD700'
    if (props.isSelected) return '#4ECDC4'
    return 'transparent'
  }};
  background: ${props => {
    switch (props.faction) {
      case 1: return 'rgba(255, 68, 68, 0.1)'
      case 2: return 'rgba(68, 68, 255, 0.1)'
      case 3: return 'rgba(68, 255, 68, 0.1)'
      default: return 'rgba(255, 255, 255, 0.05)'
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
  }
`

const FactionName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

const FactionDescription = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.4;
`

const FactionIcon = styled.div<{ faction: number }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => {
    switch (props.faction) {
      case 1: return '#FF4444'
      case 2: return '#4444FF'
      case 3: return '#44FF44'
      default: return '#666666'
    }
  }};
  margin-bottom: 0.5rem;
`

export default function FactionSelector({ factions, selectedFaction, onFactionSelect }: FactionSelectorProps) {
  return (
    <Container>
      <Title>Choose Your Faction</Title>
      {factions.map((faction) => (
        <FactionCard
          key={faction.id}
          faction={faction.id}
          isSelected={selectedFaction === faction.id}
          isPlayerFaction={selectedFaction === faction.id}
          onClick={() => onFactionSelect(faction.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FactionIcon faction={faction.id} />
          <FactionName>{faction.symbol} {faction.name}</FactionName>
          <FactionDescription>
            Created by: {faction.creator?.slice(0, 6)}...{faction.creator?.slice(-4)}
            <br />
            Members: {faction.memberCount || 1} • Territories: {faction.totalTerritories || 0}
          </FactionDescription>
        </FactionCard>
      ))}
      
      {factions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          opacity: 0.6
        }}>
          No factions available. Create the first one!
        </div>
      )}
    </Container>
  )
}



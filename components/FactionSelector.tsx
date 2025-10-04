import styled from 'styled-components'
import { motion } from 'framer-motion'

interface FactionSelectorProps {
  factions: any[]
  selectedFaction: number
  onFactionSelect: (factionId: number) => void
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

const FactionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
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

const FactionCard = styled(motion.div)<{ faction: number; isSelected: boolean; isPlayerFaction: boolean }>`
  font-family: 'Inter', sans-serif;
  padding: 0.4rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => {
    if (props.isPlayerFaction) return '#836EF9' /* Monad Moru - selected */
    if (props.isSelected) return 'rgba(131, 110, 249, 0.5)'
    return 'rgba(251, 250, 249, 0.1)'
  }};
  background: ${props => {
    switch (props.faction) {
      case 1: return 'rgba(131, 110, 249, 0.1)' /* Monad Moru */
      case 2: return 'rgba(160, 5, 93, 0.1)' /* Monad Böğürtleni */
      case 3: return 'rgba(251, 250, 249, 0.05)' /* Monad Kirli Beyaz */
      case 4: return 'rgba(14, 16, 15, 0.2)' /* Monad Siyahı */
      default: return 'rgba(14, 16, 15, 0.1)' /* Monad Siyahı */
    }
  }};
  box-shadow: ${props => {
    if (props.isPlayerFaction) return '0 2px 8px rgba(131, 110, 249, 0.3)'
    if (props.isSelected) return '0 2px 8px rgba(131, 110, 249, 0.2)'
    return '0 1px 4px rgba(32, 0, 82, 0.1)'
  }};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(131, 110, 249, 0.2);
  }
`

const FactionName = styled.div`
  font-family: 'Inter', sans-serif;
  font-weight: 600; /* Inter SemiBold */
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  color: #FBFAF9; /* Monad Kirli Beyaz */
  letter-spacing: -0.01em; /* Inter optimal spacing */
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const FactionDescription = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 400; /* Inter Regular */
  color: rgba(251, 250, 249, 0.6); /* Monad Kirli Beyaz - muted */
  line-height: 1.2;
  letter-spacing: -0.01em;
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
      <FactionGrid>
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
            <FactionName>{faction.symbol} {faction.name}</FactionName>
            <FactionDescription>
              {faction.description}
            </FactionDescription>
          </FactionCard>
        ))}
      </FactionGrid>
      
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



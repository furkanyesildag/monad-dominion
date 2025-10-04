import styled from 'styled-components'
import { motion } from 'framer-motion'

interface FactionSelectorProps {
  factions: any[]
  selectedFaction: number
  onFactionSelect: (factionId: number) => void
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
  border: 4px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  box-shadow: 
    inset 3px 3px 0 rgba(255, 255, 255, 0.2),
    inset -3px -3px 0 rgba(0, 0, 0, 0.4),
    6px 6px 0 rgba(131, 110, 249, 0.3);
  border-radius: 0;
  padding: 1.25rem;
  image-rendering: pixelated;
`

const FactionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`

const Title = styled.h3`
  font-family: 'Press Start 2P', 'Inter', monospace;
  margin: 0 0 1rem 0;
  font-size: 13px; /* BIGGER! */
  font-weight: 400;
  color: #FBFAF9;
  text-shadow: 
    3px 3px 0 #836EF9,
    5px 5px 0 rgba(131, 110, 249, 0.5);
  letter-spacing: 1px;
  image-rendering: pixelated;
  line-height: 1.6;
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

const FactionName = styled.div<{ faction: number }>`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-weight: 400;
  font-size: 11px;
  margin-bottom: 0.5rem;
  color: ${props => {
    switch (props.faction) {
      case 1: return '#228B22' /* Cmty - Koyu Yeşil */
      case 2: return '#A0055D' /* Eco - Monad Böğürtleni */
      case 3: return '#FBFAF9' /* Dev - Monad Kirli Beyaz */
      case 4: return '#0E100F' /* Xyz - Monad Siyahı */
      default: return '#FBFAF9'
    }
  }};
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: ${props => {
    switch (props.faction) {
      case 1: return '2px 2px 0 rgba(0, 0, 0, 0.8)' /* Cmty için siyah gölge */
      case 2: return '2px 2px 0 rgba(0, 0, 0, 0.8)'
      case 3: return '2px 2px 0 rgba(0, 0, 0, 0.8)'
      case 4: return '2px 2px 0 rgba(255, 255, 255, 0.8)'
      default: return '2px 2px 0 rgba(0, 0, 0, 0.8)'
    }
  }};
  image-rendering: pixelated;
  line-height: 1.6;
`

const FactionDescription = styled.div`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 8px; /* BIGGER! */
  font-weight: 400;
  color: rgba(251, 250, 249, 0.7);
  line-height: 1.8;
  letter-spacing: 1px;
  image-rendering: pixelated;
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
            <FactionName faction={faction.id}>{faction.symbol} {faction.name}</FactionName>
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



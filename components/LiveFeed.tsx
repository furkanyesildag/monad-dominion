import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

interface TerritoryUpdate {
  territoryId: number
  factionId: number
  player: string
  timestamp: number
}

interface LiveFeedProps {
  updates: TerritoryUpdate[]
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 300px;
  overflow-y: auto;
`

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const UpdateItem = styled(motion.div)<{ faction: number }>`
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: ${props => {
    switch (props.faction) {
      case 1: return 'rgba(255, 68, 68, 0.1)'
      case 2: return 'rgba(68, 68, 255, 0.1)'
      case 3: return 'rgba(68, 255, 68, 0.1)'
      default: return 'rgba(255, 255, 255, 0.05)'
    }
  }};
  border-left: 3px solid ${props => {
    switch (props.faction) {
      case 1: return '#FF4444'
      case 2: return '#4444FF'
      case 3: return '#44FF44'
      default: return '#666666'
    }
  }};
`

const UpdateText = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
`

const PlayerAddress = styled.span`
  font-family: monospace;
  font-size: 0.8rem;
  opacity: 0.7;
`

const Timestamp = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 0.25rem;
`

const factions = [
  { id: 1, name: 'Crimson Legion', icon: '🔥' },
  { id: 2, name: 'Azure Order', icon: '🌊' },
  { id: 3, name: 'Emerald Circle', icon: '🌿' }
]

function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function LiveFeed({ updates }: LiveFeedProps) {
  return (
    <Container>
      <Title>
        ⚡ Live Battle Feed
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ color: '#4ECDC4' }}
        >
          ●
        </motion.div>
      </Title>
      
      <AnimatePresence>
        {updates.slice(0, 10).map((update, index) => {
          const faction = factions.find(f => f.id === update.faction)
          
          return (
            <UpdateItem
              key={`${update.territoryId}-${update.timestamp}`}
              faction={update.faction}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <UpdateText>
                <strong>{faction?.icon} {faction?.name}</strong> claimed territory #{update.territoryId}
                <br />
                <PlayerAddress>{shortenAddress(update.player)}</PlayerAddress>
              </UpdateText>
              <Timestamp>{formatTimeAgo(update.timestamp)}</Timestamp>
            </UpdateItem>
          )
        })}
      </AnimatePresence>
      
      {updates.length === 0 && (
        <div style={{ textAlign: 'center', opacity: 0.6, padding: '2rem' }}>
          Waiting for battle activity...
        </div>
      )}
    </Container>
  )
}





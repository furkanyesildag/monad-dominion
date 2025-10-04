import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

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
  font-family: 'Press Start 2P', 'Inter', monospace;
  background: 
    repeating-linear-gradient(
      45deg,
      #200052 0px, #200052 4px,
      #0E100F 4px, #0E100F 8px
    );
  backdrop-filter: blur(24px);
  border: 1px solid;
  border-color: #FBFAF9 #836EF9 #836EF9 #FBFAF9;
  box-shadow: 
    inset 1px 1px 0 rgba(255, 255, 255, 0.2),
    inset -1px -1px 0 rgba(0, 0, 0, 0.4),
    2px 2px 0 rgba(131, 110, 249, 0.3);
  border-radius: 0;
  padding: 0.3rem;
  image-rendering: pixelated;
  max-height: 80px;
  overflow-y: auto;
  width: 100%;
  max-width: 150px;
`

const Title = styled.h3`
  font-family: 'Press Start 2P', 'Inter', monospace;
  margin: 0 0 0.3rem 0;
  font-size: 6px;
  font-weight: 400;
  color: #FBFAF9;
  text-shadow: 
    1px 1px 0 #836EF9,
    2px 2px 0 rgba(131, 110, 249, 0.5);
  letter-spacing: 0.3px;
  image-rendering: pixelated;
  line-height: 1.0;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  justify-content: center;
`

const UpdateItem = styled(motion.div)<{ faction: number }>`
  padding: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 2px solid ${props => {
    switch (props.faction) {
      case 1: return '#836EF9'
      case 2: return '#A0055D'
      case 3: return '#FBFAF9'
      case 4: return '#0E100F'
      default: return '#666666'
    }
  }};
  font-family: 'Press Start 2P', 'Inter', monospace;
  image-rendering: pixelated;
`

const UpdateText = styled.div`
  font-size: 4px;
  line-height: 1.0;
  color: #FBFAF9;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  image-rendering: pixelated;
`

const PlayerAddress = styled.span`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 3px;
  opacity: 0.7;
  image-rendering: pixelated;
`

const Timestamp = styled.div`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 3px;
  opacity: 0.6;
  margin-top: 0.1rem;
  image-rendering: pixelated;
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
          const faction = factions.find(f => f.id === update.factionId)
          
          return (
            <UpdateItem
              key={`${update.territoryId}-${update.timestamp}`}
              faction={update.factionId}
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
              <Timestamp>{mounted ? formatTimeAgo(update.timestamp) : 'Just now'}</Timestamp>
            </UpdateItem>
          )
        })}
      </AnimatePresence>
      
      {updates.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          opacity: 0.6, 
          padding: '0.5rem',
          fontFamily: 'Press Start 2P, Inter, monospace',
          fontSize: '3px',
          color: 'rgba(251, 250, 249, 0.7)',
          imageRendering: 'pixelated'
        }}>
          Waiting for battle activity...
        </div>
      )}
    </Container>
  )
}





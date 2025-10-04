import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Monad Logo SVG Component with Dynamic Colors and Animations
const MonadLogo = ({ faction }: { faction: number }) => {
  const logoColor = (() => {
    switch (faction) {
      case 1: return '#836EF9' // Monad Purple
      case 2: return '#A0055D' // Monad Berry
      case 3: return '#FBFAF9' // Monad Off-White
      case 4: return '#0E100F' // Monad Black
      default: return 'rgba(131, 110, 249, 0.8)' // Default Purple
    }
  })()

  const glowColor = (() => {
    switch (faction) {
      case 1: return '#9B8BF9' // Lighter Purple
      case 2: return '#C0076F' // Lighter Berry
      case 3: return '#FFFFFF' // Pure White
      case 4: return '#1A1C1B' // Lighter Black
      default: return 'rgba(131, 110, 249, 0.9)' // Default Lighter Purple
    }
  })()

  return (
    <motion.svg 
      width="26" 
      height="26" 
      viewBox="0 0 33 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor}40)`,
      }}
    >
      <motion.path 
        d="M16.6288 0C12.0084 0 0.628906 11.3792 0.628906 15.9999C0.628906 20.6206 12.0084 32 16.6288 32C21.2492 32 32.6289 20.6204 32.6289 15.9999C32.6289 11.3794 21.2494 0 16.6288 0ZM14.1355 25.1492C12.1871 24.6183 6.94871 15.455 7.47973 13.5066C8.01075 11.5581 17.1739 6.31979 19.1222 6.8508C21.0707 7.38173 26.3091 16.5449 25.7781 18.4934C25.2471 20.4418 16.0839 25.6802 14.1355 25.1492Z" 
        fill={logoColor}
        animate={{
          fill: [logoColor, glowColor, logoColor],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.svg>
  )
}

interface HexGridProps {
  territories: Map<number, number>
  onTerritoryClick: (territoryId: number) => void
  playerFaction: number
}

const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0.5rem;
  background: radial-gradient(circle at center, rgba(131, 110, 249, 0.03) 0%, transparent 70%);
`

const HexGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  transform: scale(0.98);
  filter: drop-shadow(0 0 20px rgba(131, 110, 249, 0.15));
  max-width: 100%;
  max-height: 100%;
`

const HexRow = styled.div<{ isOdd: boolean }>`
  display: flex;
  gap: 2px;
  margin-left: ${props => props.isOdd ? '20px' : '0px'};
  margin-bottom: -6px;
`

const MonadSymbol = styled(motion.div)<{ faction: number }>`
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: none;
  z-index: 2;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  
  svg {
    width: 100%;
    height: 100%;
    filter: ${props => {
      switch (props.faction) {
        case 1: return 'drop-shadow(2px 2px 0 #6B5CE7) drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.5))' // Purple shadow
        case 2: return 'drop-shadow(2px 2px 0 #8B0451) drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.5))' // Berry shadow
        case 3: return 'drop-shadow(2px 2px 0 #E8E7E6) drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.5))' // White shadow
        case 4: return 'drop-shadow(2px 2px 0 #1A1C1B) drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.5))' // Black shadow
        default: return 'drop-shadow(2px 2px 0 rgba(131, 110, 249, 0.6)) drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.5))'
      }
    }};
  }
`

const LogoContainer = styled(motion.div)<{ faction: number; isPlayerFaction: boolean }>`
  width: 55px;
  height: 55px;
  cursor: pointer;
  position: relative;
  transition: none;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Faction-based glow effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    transform: translate(-50%, -50%);
    background: ${props => {
      switch (props.faction) {
        case 1: return 'radial-gradient(circle, rgba(131, 110, 249, 0.3) 0%, transparent 70%)'
        case 2: return 'radial-gradient(circle, rgba(160, 5, 93, 0.3) 0%, transparent 70%)'
        case 3: return 'radial-gradient(circle, rgba(251, 250, 249, 0.3) 0%, transparent 70%)'
        case 4: return 'radial-gradient(circle, rgba(14, 16, 15, 0.3) 0%, transparent 70%)'
        default: return 'radial-gradient(circle, rgba(131, 110, 249, 0.2) 0%, transparent 70%)'
      }
    }};
    border-radius: 50%;
    z-index: -1;
    animation: ${props => {
      switch (props.faction) {
        case 1: return 'pulsePurple 2s ease-in-out infinite'
        case 2: return 'pulseBerry 2s ease-in-out infinite'
        case 3: return 'pulseWhite 2s ease-in-out infinite'
        case 4: return 'pulseBlack 2s ease-in-out infinite'
        default: return 'pulseDefault 2s ease-in-out infinite'
      }
    }};
  }
  
  @keyframes pulsePurple {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }
  
  @keyframes pulseBerry {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }
  
  @keyframes pulseWhite {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }
  
  @keyframes pulseBlack {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
  }
  
  @keyframes pulseDefault {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
  }
  
  
  &:hover {
    transform: scale(1.3) rotate(5deg);
    filter: none;
    z-index: 15;
    animation: none;
    transition: none;
      
    &::before {
      animation: none;
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0.8;
    }
      
    ${MonadSymbol} {
      width: 40px;
      height: 40px;
      
      svg {
        filter: ${props => {
          switch (props.faction) {
            case 1: return 'drop-shadow(6px 6px 0 #6B5CE7) drop-shadow(12px 12px 0 rgba(0, 0, 0, 0.7)) brightness(1.5) saturate(1.5)'
            case 2: return 'drop-shadow(6px 6px 0 #8B0451) drop-shadow(12px 12px 0 rgba(0, 0, 0, 0.7)) brightness(1.5) saturate(1.5)'
            case 3: return 'drop-shadow(6px 6px 0 #E8E7E6) drop-shadow(12px 12px 0 rgba(0, 0, 0, 0.7)) brightness(1.5) saturate(1.5)'
            case 4: return 'drop-shadow(6px 6px 0 #1A1C1B) drop-shadow(12px 12px 0 rgba(0, 0, 0, 0.7)) brightness(1.5) saturate(1.5)'
            default: return 'drop-shadow(6px 6px 0 rgba(131, 110, 249, 0.8)) drop-shadow(12px 12px 0 rgba(0, 0, 0, 0.7)) brightness(1.5) saturate(1.5)'
          }
        }};
      }
    }
  }
  
  &:active {
    transform: scale(1.2) translate(3px, 3px) rotate(-2deg);
    transition: none;
    
    &::before {
      transform: translate(-50%, -50%) scale(1.8);
      opacity: 1;
    }
  }
`

const FactionColors = {
  1: '#FF4444', // Crimson Legion
  2: '#4444FF', // Azure Order
  3: '#44FF44', // Emerald Circle
  0: '#333333'  // Unclaimed
}

export default function HexGrid({ territories, onTerritoryClick, playerFaction }: HexGridProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const generateHexGrid = () => {
    const rows = 10
    const cols = 14
    const hexRows = []
    
    for (let row = 0; row < rows; row++) {
      const hexTiles = []
      const colsInRow = row % 2 === 0 ? cols : cols - 1
      
      for (let col = 0; col < colsInRow; col++) {
        const territoryId = row * cols + col
        const faction = territories?.get(territoryId) || 0
        const isPlayerFaction = faction === playerFaction
        
        hexTiles.push(
          <LogoContainer
            key={`hex-${territoryId}`}
            faction={faction}
            isPlayerFaction={isPlayerFaction}
            onClick={() => onTerritoryClick(territoryId)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: (row * cols + col) * 0.001,
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <MonadSymbol 
              faction={faction}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: (row * cols + col) * 0.05,
                duration: 0.6,
                ease: "backOut"
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.3 }
              }}
            >
              <MonadLogo faction={faction} />
            </MonadSymbol>
          </LogoContainer>
        )
      }
      
      hexRows.push(
        <HexRow key={`row-${row}`} isOdd={row % 2 === 1}>
          {hexTiles}
        </HexRow>
      )
    }
    
    return hexRows
  }

  return (
    <GridContainer>
      <HexGridWrapper>
        {mounted ? generateHexGrid() : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px',
            fontSize: '1.2rem',
            opacity: 0.6
          }}>
            🔄 Loading battle map...
          </div>
        )}
      </HexGridWrapper>
    </GridContainer>
  )
}


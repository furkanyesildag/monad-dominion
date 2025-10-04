import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

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
  overflow: auto;
  padding: 0.5rem;
  background: radial-gradient(circle at center, rgba(131, 110, 249, 0.03) 0%, transparent 70%);
`

const HexGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  transform: scale(1.1);
  filter: drop-shadow(0 0 20px rgba(131, 110, 249, 0.15));
`

const HexRow = styled.div<{ isOdd: boolean }>`
  display: flex;
  gap: 2px;
  margin-left: ${props => props.isOdd ? '23px' : '0px'};
  margin-bottom: -8px;
`

const MonadSymbol = styled.div<{ faction: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${props => {
    switch (props.faction) {
      case 1: return 'rgba(255, 255, 255, 0.95)' // Beyaz on Moru
      case 2: return 'rgba(255, 255, 255, 0.95)' // Beyaz on Böğürtleni
      case 3: return 'rgba(131, 110, 249, 0.95)' // Moru on Beyaz
      case 4: return 'rgba(251, 250, 249, 0.95)' // Beyaz on Siyah
      default: return 'rgba(100, 100, 100, 0.8)' // Dark Gray on Unclaimed
    }
  }};
  border: 1px solid ${props => {
    switch (props.faction) {
      case 1: return 'rgba(255, 255, 255, 0.5)'
      case 2: return 'rgba(255, 255, 255, 0.5)'
      case 3: return 'rgba(131, 110, 249, 0.5)'
      case 4: return 'rgba(251, 250, 249, 0.5)'
      default: return 'rgba(100, 100, 100, 0.4)'
    }
  }};
  box-shadow: 
    0 0 10px rgba(131, 110, 249, 0.4),
    inset 0 1px 3px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 8px;
  color: ${props => {
    switch (props.faction) {
      case 1: return '#836EF9' // Moru text on Beyaz circle
      case 2: return '#A0055D' // Böğürtleni text on Beyaz circle
      case 3: return '#FBFAF9' // Beyaz text on Moru circle
      case 4: return '#836EF9' // Moru text on Beyaz circle
      default: return '#FFFFFF' // White text on Gray circle
    }
  }};
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 2;
  
  &::before {
    content: 'M';
  }
`

const HexTile = styled(motion.div)<{ faction: number; isPlayerFaction: boolean }>`
  width: 45px;
  height: 45px;
  background: ${props => {
    switch (props.faction) {
      case 1: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #836EF9 0%, #7C65F8 40%, #6B5CE6 70%, #5A4DD4 100%)
      ` // Cmty - Monad Moru
      case 2: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #A0055D 0%, #8F0452 40%, #7E0347 70%, #6D023C 100%)
      ` // Eco - Monad Böğürtleni
      case 3: return `
        radial-gradient(circle at 30% 30%, rgba(14, 16, 15, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #FBFAF9 0%, #F0EFE8 40%, #E5E4D7 70%, #DAD9C6 100%)
      ` // Dev - Monad Kirli Beyaz
      case 4: return `
        radial-gradient(circle at 30% 30%, rgba(251, 250, 249, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #0E100F 0%, #1A1C1B 40%, #262827 70%, #323433 100%)
      ` // Xyz - Monad Siyahı
      default: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
        linear-gradient(135deg, #FFFFFF 0%, #F8F8F8 40%, #F0F0F0 70%, #E8E8E8 100%)
      ` // Unclaimed - Pure White
    }
  }};
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  cursor: pointer;
  border: ${props => props.isPlayerFaction ? '2px solid #FFD700' : 'none'};
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  
  &:before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background: ${props => {
      switch (props.faction) {
        case 1: return 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, transparent 70%)'
        case 2: return 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, transparent 70%)'
        case 3: return 'linear-gradient(135deg, rgba(149, 225, 211, 0.2) 0%, transparent 70%)'
        default: return 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
      }
    }};
    clip-path: inherit;
    pointer-events: none;
  }
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  
  &:hover {
    transform: scale(1.3) translateY(-4px) rotateZ(2deg);
    filter: brightness(1.4) saturate(1.3) contrast(1.1);
    z-index: 15;
    box-shadow: 
      0 12px 30px rgba(0, 0, 0, 0.7),
      0 0 25px ${props => {
        switch (props.faction) {
          case 1: return 'rgba(255, 68, 68, 0.6)'
          case 2: return 'rgba(78, 205, 196, 0.6)'
          case 3: return 'rgba(68, 255, 68, 0.6)'
          default: return 'rgba(255, 255, 255, 0.3)'
        }
      }},
      inset 0 2px 0 rgba(255, 255, 255, 0.4);
      
    ${MonadSymbol} {
      width: 22px;
      height: 22px;
      font-size: 10px;
      box-shadow: 
        0 0 15px rgba(131, 110, 249, 0.8),
        inset 0 2px 4px rgba(255, 255, 255, 0.5);
    }
  }
  
  &:active {
    transform: scale(1.2) translateY(-2px);
    transition: all 0.1s ease;
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
          <HexTile
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
            <MonadSymbol faction={faction} />
          </HexTile>
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
      <div style={{ 
        color: 'rgba(255,255,255,0.8)', 
        marginBottom: '20px', 
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center'
      }}>
        🗺️ Battle Map • {mounted ? (territories?.size || 0) : 0} Territories Claimed
      </div>
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


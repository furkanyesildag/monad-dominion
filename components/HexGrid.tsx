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
  padding: 20px;
  background: radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%);
`

const HexGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  transform: scale(0.9);
  filter: drop-shadow(0 0 20px rgba(78, 205, 196, 0.1));
`

const HexRow = styled.div<{ isOdd: boolean }>`
  display: flex;
  gap: 1px;
  margin-left: ${props => props.isOdd ? '30px' : '0px'};
  margin-bottom: -10px;
`

const HexTile = styled(motion.div)<{ faction: number; isPlayerFaction: boolean }>`
  width: 60px;
  height: 60px;
  background: ${props => {
    switch (props.faction) {
      case 1: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #FF6B6B 0%, #FF4444 40%, #E63946 70%, #CC2222 100%)
      ` // Crimson Legion
      case 2: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #4ECDC4 0%, #4895EF 40%, #4361EE 70%, #3F37C9 100%)
      ` // Azure Order  
      case 3: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #95E1D3 0%, #52B788 40%, #40916C 70%, #2D6A4F 100%)
      ` // Emerald Circle
      default: return `
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #6C757D 0%, #495057 40%, #343A40 70%, #212529 100%)
      ` // Unclaimed
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
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
        width: 10px;
        height: 10px;
    background: ${props => {
      switch (props.faction) {
        case 1: return 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)'
        case 2: return 'radial-gradient(circle, #87CEEB 0%, #4682B4 100%)'
        case 3: return 'radial-gradient(circle, #98FB98 0%, #228B22 100%)'
        default: return 'none'
      }
    }};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: ${props => props.faction > 0 ? 0.8 : 0};
    transition: all 0.3s ease;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
  }
  
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
      
                &:after {
                  width: 14px;
                  height: 14px;
      opacity: 1;
      box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
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
          />
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


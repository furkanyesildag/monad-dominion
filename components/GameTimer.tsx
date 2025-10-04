import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface GameTimerProps {
  gameActive: boolean
  gameStartTime: number
  onGameEnd: () => void
  onStartGame: () => void
  isStartingGame: boolean
  gamesPlayedToday?: number
  maxGamesPerDay?: number
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
  text-align: center;
`

const Title = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 700; /* Inter Bold */
  margin-bottom: 0.5rem;
  color: #FBFAF9; /* Monad Kirli Beyaz */
  text-shadow: 0 0 16px rgba(131, 110, 249, 0.4); /* Monad Moru glow */
  letter-spacing: -0.01em; /* Inter optimal spacing */
`

const TimerDisplay = styled.div<{ timeLeft: number }>`
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 800; /* Inter Extra Bold */
  margin: 0.5rem 0;
  letter-spacing: -0.02em; /* Inter optimal spacing */
  color: ${props => {
    if (props.timeLeft <= 30) return '#A0055D' /* Monad Böğürtleni - urgent */
    if (props.timeLeft <= 60) return '#836EF9' /* Monad Moru - warning */
    return '#FBFAF9' /* Monad Kirli Beyaz - normal */
  }};
  text-shadow: ${props => {
    if (props.timeLeft <= 30) return '0 0 15px rgba(160, 5, 93, 0.6)'
    if (props.timeLeft <= 60) return '0 0 15px rgba(131, 110, 249, 0.6)'
    return '0 0 12px rgba(251, 250, 249, 0.3)'
  }};
`

const GameStatus = styled.div<{ active: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 600; /* Inter SemiBold */
  margin: 0.375rem 0;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  background: ${props => props.active ? '#836EF9' : 'rgba(14, 16, 15, 0.4)'}; /* Monad Moru / Monad Siyahı */
  color: #FBFAF9; /* Monad Kirli Beyaz */
  display: inline-block;
  border: 1px solid ${props => props.active ? 'rgba(251, 250, 249, 0.2)' : 'rgba(251, 250, 249, 0.1)'};
  box-shadow: ${props => props.active ? '0 2px 8px rgba(131, 110, 249, 0.2)' : 'none'};
  letter-spacing: 0.02em;
  text-transform: uppercase;
`

const StartButton = styled(motion.button)`
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); /* Orange gradient */
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #FFFFFF;
  padding: 0.6rem 1.2rem;
  font-size: 0.8rem;
  font-weight: 700; /* Inter Bold */
  cursor: pointer;
  margin-top: 0.5rem;
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.4);
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF5722 0%, #D32F2F 100%); /* Red gradient on hover */
    box-shadow: 0 6px 20px rgba(255, 87, 34, 0.5);
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%); /* Gray gradient */
    color: rgba(255, 255, 255, 0.6);
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
    transform: none;
  }
`

const RoundInfo = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 400; /* Inter Regular */
  color: rgba(251, 250, 249, 0.7); /* Monad Kirli Beyaz - muted */
  margin-bottom: 0.375rem;
  letter-spacing: -0.01em;
`

const GAME_DURATION = 120 // 2 minutes

export default function GameTimer({ gameActive, gameStartTime, onGameEnd, onStartGame, isStartingGame, gamesPlayedToday = 0, maxGamesPerDay = 6 }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [currentRound, setCurrentRound] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log('🔥 Timer useEffect triggered:', { gameActive, gameStartTime, timeLeft })
    
    if (!gameActive) {
      console.log('❌ Game not active, resetting timer to', GAME_DURATION)
      setTimeLeft(GAME_DURATION)
      return
    }

    if (!gameStartTime || gameStartTime === 0) {
      console.log('⏳ No valid gameStartTime, waiting...', gameStartTime)
      return
    }

    // Calculate initial time immediately
    const now = Math.floor(Date.now() / 1000)
    const elapsed = now - gameStartTime
    const initialRemaining = Math.max(0, GAME_DURATION - elapsed)
    
    console.log('🚀 Setting initial timer:', { now, gameStartTime, elapsed, initialRemaining })
    setTimeLeft(initialRemaining)

    console.log('⏰ Starting timer interval...')
    const interval = setInterval(() => {
      const currentNow = Math.floor(Date.now() / 1000)
      const currentElapsed = currentNow - gameStartTime
      const currentRemaining = Math.max(0, GAME_DURATION - currentElapsed)
      
      console.log('⏱️ Timer tick:', { 
        currentNow, 
        gameStartTime, 
        currentElapsed, 
        currentRemaining, 
        gameActive,
        difference: currentNow - gameStartTime 
      })
      
      // Force re-render to ensure UI updates
      setTimeLeft(currentRemaining)
      setForceUpdate(prev => prev + 1)
      
      if (currentRemaining === 0) {
        console.log('🏁 Timer finished, calling onGameEnd')
        console.log('🔥 TIMER REACHED ZERO - CALLING GAME END!')
        
        // Clear interval immediately to prevent multiple calls
        clearInterval(interval)
        
        // Call game end with a small delay to ensure state is updated
        setTimeout(() => {
          console.log('🚀 Calling onGameEnd after delay')
          alert('⏰ TIME UP! Game ending now...')
          onGameEnd()
        }, 100)
        
        setCurrentRound(prev => prev + 1)
        return // Exit the interval
      }
    }, 1000)

    return () => {
      console.log('🛑 Clearing timer interval')
      clearInterval(interval)
    }
  }, [gameActive, gameStartTime, onGameEnd])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Container>
      <Title>⏰ Game Timer</Title>
      
      <RoundInfo>Round #{currentRound}</RoundInfo>
      
      <GameStatus active={gameActive}>
        {gameActive ? '🔴 GAME ACTIVE' : '⚪ WAITING'}
      </GameStatus>
      
      <TimerDisplay timeLeft={timeLeft}>
        {formatTime(timeLeft)} {/* Force: {forceUpdate} */}
      </TimerDisplay>
      
      {!gameActive ? (
        <StartButton
          onClick={onStartGame}
          disabled={isStartingGame || gamesPlayedToday >= maxGamesPerDay}
          whileHover={{ scale: gamesPlayedToday >= maxGamesPerDay ? 1 : 1.05 }}
          whileTap={{ scale: gamesPlayedToday >= maxGamesPerDay ? 1 : 0.95 }}
        >
          {isStartingGame ? '🔄 Starting Game...' : 
           gamesPlayedToday >= maxGamesPerDay ? `🚫 Daily Limit Reached (${gamesPlayedToday}/${maxGamesPerDay})` :
           `🚀 Start New Game (${gamesPlayedToday}/${maxGamesPerDay} today)`}
        </StartButton>
      ) : (
        <div style={{ fontSize: '1rem', opacity: 0.8, marginTop: '1rem' }}>
          {timeLeft > 60 ? '⚔️ Battle in progress!' : 
           timeLeft > 30 ? '🔥 Final minute!' : 
           timeLeft > 0 ? '⚡ Last seconds!' :
           <div>
             <div style={{ color: '#FF4444', fontWeight: 'bold', marginBottom: '1rem' }}>
               ⏰ TIME UP!
             </div>
             <button 
               onClick={() => {
                 console.log('🔴 Manual game end triggered')
                 alert('🔴 Manually ending game...')
                 onGameEnd()
               }}
               style={{
                 background: '#FF4444',
                 color: 'white',
                 border: 'none',
                 padding: '0.75rem 1.5rem',
                 borderRadius: '8px',
                 cursor: 'pointer',
                 fontWeight: 'bold'
               }}
             >
               🏁 End Game Now
             </button>
           </div>
          }
        </div>
      )}
      
      <div style={{ 
        fontSize: '0.9rem', 
        opacity: 0.6, 
        marginTop: '1rem',
        lineHeight: 1.4
      }}>
        {gameActive 
          ? 'Claim territories by clicking hexagons. No transaction fees during gameplay!'
          : mounted 
            ? 'Start a new 2-minute battle round. Winner gets NFT rewards! (Note: Monad testnet can be slow, please be patient)'
            : 'Loading game data...'
        }
      </div>
    </Container>
  )
}

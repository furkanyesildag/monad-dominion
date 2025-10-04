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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`

const TimerDisplay = styled.div<{ timeLeft: number }>`
  font-size: 3rem;
  font-weight: bold;
  margin: 1.5rem 0;
  color: ${props => {
    if (props.timeLeft <= 30) return '#FF4444'
    if (props.timeLeft <= 60) return '#FFA500'
    return '#4ECDC4'
  }};
  text-shadow: 0 0 20px currentColor;
`

const GameStatus = styled.div<{ active: boolean }>`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem 0;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  background: ${props => props.active 
    ? 'linear-gradient(45deg, #44FF44, #22CC22)' 
    : 'linear-gradient(45deg, #666666, #444444)'
  };
  color: white;
  display: inline-block;
`

const StartButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 12px;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`

const RoundInfo = styled.div`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 1rem;
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

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
  text-align: center;
  image-rendering: pixelated;
`

const Title = styled.h2`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 14px; /* BIGGER! */
  font-weight: 400;
  margin-bottom: 1rem;
  color: #FBFAF9;
  text-shadow: 
    3px 3px 0 #836EF9,
    5px 5px 0 rgba(131, 110, 249, 0.5);
  letter-spacing: 1px;
  image-rendering: pixelated;
  line-height: 1.6;
`

const TimerDisplay = styled.div<{ timeLeft: number }>`
  font-family: 'Press Start 2P', 'Inter', monospace;
  font-size: 32px; /* BIGGER! */
  font-weight: 400;
  margin: 1rem 0;
  letter-spacing: 3px;
  color: ${props => {
    if (props.timeLeft <= 30) return '#A0055D' /* Monad Berry - urgent */
    if (props.timeLeft <= 60) return '#836EF9' /* Monad Purple - warning */
    return '#FBFAF9' /* Monad Off-White - normal */
  }};
  text-shadow: ${props => {
    if (props.timeLeft <= 30) return '4px 4px 0 rgba(160, 5, 93, 0.8), 6px 6px 0 #200052'
    if (props.timeLeft <= 60) return '4px 4px 0 rgba(131, 110, 249, 0.8), 6px 6px 0 #200052'
    return '4px 4px 0 rgba(131, 110, 249, 0.5), 6px 6px 0 #200052'
  }};
  image-rendering: pixelated;
  line-height: 1.4;
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
  font-family: 'Press Start 2P', 'Inter', monospace;
  background: 
    repeating-linear-gradient(
      0deg,
      #FF9800 0px, #FF9800 2px,
      #FFA500 2px, #FFA500 4px
    );
  border: 4px solid;
  border-color: #FBFAF9 #FF6600 #FF6600 #FBFAF9;
  border-radius: 0;
  color: #FFFFFF;
  padding: 14px 24px; /* BIGGER! */
  font-size: 13px; /* BIGGER! */
  font-weight: 400;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 
    inset 3px 3px 0 rgba(255, 255, 255, 0.3),
    inset -3px -3px 0 rgba(0, 0, 0, 0.3),
    6px 6px 0 #FF6600;
  transition: none;
  letter-spacing: 2px;
  text-transform: uppercase;
  image-rendering: pixelated;
  
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

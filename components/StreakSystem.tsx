import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface StreakSystemProps {
  playerAddress?: string
  onStreakUpdate: (streakData: StreakData) => void
}

export interface StreakData {
  minuteStreak: number
  gamesPlayedToday: number
  maxGamesPerDay: number
  paintingCapacity: number
  lastStreakTime: string
}

const Container = styled.div`
  font-family: 'Inter', sans-serif;
  background: rgba(251, 250, 249, 0.06); /* Monad Kirli Beyaz - subtle */
  backdrop-filter: blur(24px);
  border: 1px solid rgba(251, 250, 249, 0.12);
  box-shadow: 
    0 4px 24px rgba(32, 0, 82, 0.15), /* Monad Mavisi shadow */
    inset 0 1px 0 rgba(251, 250, 249, 0.08);
  border-radius: 12px;
  padding: 1rem;
`

const Title = styled.h3`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700; /* Inter Bold */
  margin-bottom: 0.75rem;
  text-align: center;
  color: #FBFAF9; /* Monad Kirli Beyaz */
  text-shadow: 0 0 16px rgba(131, 110, 249, 0.4); /* Monad Moru glow */
  letter-spacing: -0.01em; /* Inter optimal spacing */
  line-height: 1.2;
`

const ClaimButton = styled(motion.button)`
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%); /* Purple gradient */
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #FFFFFF;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 700; /* Inter Bold */
  cursor: pointer;
  margin-top: 0.75rem;
  width: 100%;
  box-shadow: 0 4px 16px rgba(156, 39, 176, 0.4);
  transition: all 0.2s ease;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%); /* Pink gradient on hover */
    box-shadow: 0 6px 20px rgba(233, 30, 99, 0.5);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%); /* Gray gradient */
    color: rgba(255, 255, 255, 0.6);
    box-shadow: none;
    transform: none;
  }
`

const TimerDisplay = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500; /* Inter Medium */
  text-align: center;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(131, 110, 249, 0.1); /* Monad Moru - subtle */
  backdrop-filter: blur(12px);
  border: 1px solid rgba(131, 110, 249, 0.2);
  border-radius: 8px;
  color: #FBFAF9; /* Monad Kirli Beyaz */
  box-shadow: 0 2px 12px rgba(131, 110, 249, 0.15);
  letter-spacing: -0.01em;
`

const StreakDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`

const StatCard = styled.div`
  font-family: 'Inter', sans-serif;
  background: rgba(14, 16, 15, 0.2); /* Monad Siyahı - subtle */
  backdrop-filter: blur(12px);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid rgba(251, 250, 249, 0.1);
  box-shadow: 0 2px 12px rgba(32, 0, 82, 0.1);
`

const StatValue = styled.div<{ highlight?: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  font-weight: 700; /* Inter Bold */
  color: ${props => props.highlight ? '#FBFAF9' : '#FBFAF9'}; /* Monad Kirli Beyaz */
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em; /* Inter optimal spacing */
  text-shadow: ${props => props.highlight ? 
    '0 0 12px rgba(131, 110, 249, 0.6)' : /* Monad Moru glow */
    'none'
  };
`

const StatLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500; /* Inter Medium */
  color: rgba(251, 250, 249, 0.7); /* Monad Kirli Beyaz - muted */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* Inter optimal spacing */
`

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  height: 8px;
  margin: 1rem 0;
  overflow: hidden;
`

const ProgressFill = styled(motion.div)<{ percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #45B7D1);
  border-radius: 10px;
  width: ${props => props.percentage}%;
`

const CapacityInfo = styled.div`
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
`

const StreakBonus = styled.div<{ show: boolean }>`
  background: rgba(131, 110, 249, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(131, 110, 249, 0.5);
  color: #836EF9;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(131, 110, 249, 0.2);
`

const STORAGE_KEY = 'monad-dominion-streak'

export default function StreakSystem({ playerAddress, onStreakUpdate }: StreakSystemProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    minuteStreak: 0,
    gamesPlayedToday: 0,
    maxGamesPerDay: 6,
    paintingCapacity: 1,
    lastStreakTime: ''
  })
  const [mounted, setMounted] = useState(false)
  const [canClaimStreak, setCanClaimStreak] = useState(false)
  const [timeUntilNextStreak, setTimeUntilNextStreak] = useState(0)

  // Mount component first
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load streak data and check minute timer
  useEffect(() => {
    if (!mounted || !playerAddress) return

    const stored = localStorage.getItem(`${STORAGE_KEY}-${playerAddress}`)
    let data = stored ? JSON.parse(stored) : {
      minuteStreak: 0,
      gamesPlayedToday: 0,
      maxGamesPerDay: 6,
      paintingCapacity: 1,
      lastStreakTime: ''
    }
    
    // Check if 1 minute has passed since last streak claim
    const now = Date.now()
    const oneMinute = 60 * 1000 // 1 minute in milliseconds
    
    if (!data.lastStreakTime) {
      // First time - can claim immediately
      setCanClaimStreak(true)
      setTimeUntilNextStreak(0)
    } else {
      const lastStreakTime = new Date(data.lastStreakTime).getTime()
      const timeDiff = now - lastStreakTime
      
      if (timeDiff >= oneMinute) {
        setCanClaimStreak(true)
        setTimeUntilNextStreak(0)
      } else {
        setCanClaimStreak(false)
        setTimeUntilNextStreak(oneMinute - timeDiff)
      }
    }
    
    // Calculate painting capacity: base 1 + minute streak (each streak adds 1, max 10)
    data.paintingCapacity = Math.min(10, 1 + data.minuteStreak)
    
    setStreakData(data)
    onStreakUpdate(data)
  }, [mounted, playerAddress, onStreakUpdate])

  // Timer for next streak availability
  useEffect(() => {
    if (canClaimStreak || timeUntilNextStreak <= 0) return
    
    console.log('🕐 Starting timer, timeUntilNextStreak:', timeUntilNextStreak)
    
    const timer = setInterval(() => {
      setTimeUntilNextStreak(prev => {
        const newTime = prev - 1000
        console.log('⏰ Timer tick:', Math.ceil(newTime / 1000), 'seconds left')
        
        if (newTime <= 0) {
          console.log('✅ Timer finished! Enabling claim button')
          setCanClaimStreak(true)
          return 0
        }
        return newTime
      })
    }, 1000)
    
    return () => {
      console.log('🛑 Clearing timer')
      clearInterval(timer)
    }
  }, [canClaimStreak, timeUntilNextStreak])

  // Save streak data to localStorage only after mounting
  useEffect(() => {
    if (!mounted || !playerAddress) return
    localStorage.setItem(`${STORAGE_KEY}-${playerAddress}`, JSON.stringify(streakData))
  }, [mounted, streakData, playerAddress])

  const handleClaimStreak = async () => {
    if (!canClaimStreak || !playerAddress) return
    
    try {
      // Send transaction to claim streak
      const txHash = await window.ethereum?.request({
        method: 'eth_sendTransaction',
        params: [{
          from: playerAddress,
          to: playerAddress, // Send to self
          value: '0x0', // 0 ETH
          gas: '0x5208', // 21000 gas
          gasPrice: '0x174876E800' // 100 gwei
        }]
      })
      
      console.log('Streak claim transaction:', txHash)
      
      // Update streak data immediately
      const now = new Date().toISOString()
      const newStreakCount = streakData.minuteStreak + 1
      const newData = {
        ...streakData,
        minuteStreak: newStreakCount,
        lastStreakTime: now,
        paintingCapacity: Math.min(10, 1 + newStreakCount)
      }
      
      // Save to localStorage immediately
      localStorage.setItem(`${STORAGE_KEY}-${playerAddress}`, JSON.stringify(newData))
      
      // Update state
      setStreakData(newData)
      onStreakUpdate(newData)
      
      // Set timer for next claim (1 minute = 60000ms)
      setCanClaimStreak(false)
      setTimeUntilNextStreak(60000)
      
      console.log('✅ Streak updated:', newStreakCount, 'Paint capacity:', newData.paintingCapacity)
      console.log('🕐 Timer set to 60 seconds, canClaimStreak:', false)
      alert(`✅ Streak claimed! New streak: ${newStreakCount}, Paint capacity: ${newData.paintingCapacity}`)
      
    } catch (error) {
      console.error('Failed to claim streak:', error)
      alert('Failed to claim streak. Please try again.')
    }
  }

  const incrementGamePlayed = () => {
    if (streakData.gamesPlayedToday >= streakData.maxGamesPerDay) return

    const today = new Date().toDateString()
    const newData = {
      ...streakData,
      gamesPlayedToday: streakData.gamesPlayedToday + 1,
      lastPlayDate: today,
      paintingCapacity: Math.min(10, 1 + streakData.dailyStreak + streakData.gamesPlayedToday + 1)
    }

    // If this is the first game of the day, start/continue streak
    if (streakData.gamesPlayedToday === 0) {
      if (streakData.lastPlayDate !== today) {
        const lastDate = new Date(streakData.lastPlayDate)
        const todayDate = new Date()
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1 || streakData.lastPlayDate === '') {
          newData.dailyStreak = streakData.dailyStreak + 1
        } else {
          newData.dailyStreak = 1
        }
      }
    }

    setStreakData(newData)
    onStreakUpdate(newData)
  }

  // Expose increment function to parent
  useEffect(() => {
    (window as any).incrementGamePlayed = incrementGamePlayed
  }, [streakData])

  const gamesRemaining = streakData.maxGamesPerDay - streakData.gamesPlayedToday
  const progressPercentage = (streakData.gamesPlayedToday / streakData.maxGamesPerDay) * 100

  // Show loading state until mounted
  if (!mounted) {
    return (
      <Container>
        <Title>🔥 Minute Streak System</Title>
        <div style={{ textAlign: 'center', opacity: 0.6, padding: '2rem' }}>
          Loading streak data...
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Title>🔥 Minute Streak System</Title>
      
      <StreakDisplay>
        <StatCard>
          <StatValue highlight={streakData.minuteStreak > 0}>
            {streakData.minuteStreak}
          </StatValue>
          <StatLabel>Minute Streak</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>
            {streakData.paintingCapacity}
          </StatValue>
          <StatLabel>Paint Capacity</StatLabel>
        </StatCard>
      </StreakDisplay>

      <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>
        Games Today: {streakData.gamesPlayedToday}/{streakData.maxGamesPerDay}
      </div>
      
      <ProgressBar>
        <ProgressFill 
          percentage={progressPercentage}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBar>

      <CapacityInfo>
        🎨 You can paint <strong>{streakData.paintingCapacity}</strong> territories per game
        <br />
        <small>Base: 1 + Minute Streak: {streakData.minuteStreak} (Each streak +1 capacity)</small>
      </CapacityInfo>

      <ClaimButton
        onClick={handleClaimStreak}
        disabled={!canClaimStreak}
        whileHover={canClaimStreak ? { scale: 1.05 } : {}}
        whileTap={canClaimStreak ? { scale: 0.95 } : {}}
      >
        {canClaimStreak ? '⚡ Claim Streak (1 min)' : '⏰ Streak Claimed'}
      </ClaimButton>

      {!canClaimStreak && timeUntilNextStreak > 0 && (
        <TimerDisplay>
          ⏰ Next streak in: {Math.ceil(timeUntilNextStreak / 1000)}s
        </TimerDisplay>
      )}

      <StreakBonus show={streakData.minuteStreak >= 3}>
        🔥 {streakData.minuteStreak} Minute Streak! Bonus painting power!
      </StreakBonus>

      <div style={{
        fontSize: '0.8rem',
        opacity: 0.6,
        textAlign: 'center',
        marginTop: '1rem',
        lineHeight: 1.4
      }}>
        💡 Claim streak every minute to increase painting capacity!
        <br />
        Max capacity: 10 territories per game
      </div>
    </Container>
  )
}



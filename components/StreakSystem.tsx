import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface StreakSystemProps {
  playerAddress?: string
  onStreakUpdate: (streakData: StreakData) => void
}

export interface StreakData {
  dailyStreak: number
  gamesPlayedToday: number
  maxGamesPerDay: number
  paintingCapacity: number
  lastPlayDate: string
}

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
`

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(45deg, #FFD700, #FFA500);
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

const StreakDisplay = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
`

const StatValue = styled.div<{ highlight?: boolean }>`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.highlight ? '#FFD700' : '#4ECDC4'};
  margin-bottom: 0.3rem;
  text-shadow: ${props => props.highlight ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'};
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'scale(1)' : 'scale(0.8)'};
  transition: all 0.3s ease;
`

const STORAGE_KEY = 'monad-dominion-streak'

export default function StreakSystem({ playerAddress, onStreakUpdate }: StreakSystemProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    dailyStreak: 0,
    gamesPlayedToday: 0,
    maxGamesPerDay: 6,
    paintingCapacity: 1,
    lastPlayDate: ''
  })

  // Load streak data from localStorage
  useEffect(() => {
    if (!playerAddress) return

    const stored = localStorage.getItem(`${STORAGE_KEY}-${playerAddress}`)
    if (stored) {
      const data = JSON.parse(stored)
      const today = new Date().toDateString()
      
      // Check if it's a new day
      if (data.lastPlayDate !== today) {
        // New day - check if streak continues
        const lastDate = new Date(data.lastPlayDate)
        const todayDate = new Date()
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === 1) {
          // Consecutive day - increase streak
          data.dailyStreak += 1
        } else if (daysDiff > 1) {
          // Streak broken - reset
          data.dailyStreak = 1
        }
        
        // Reset daily games
        data.gamesPlayedToday = 0
        data.lastPlayDate = today
      }
      
      // Calculate painting capacity based on streak and daily games
      data.paintingCapacity = Math.min(10, 1 + data.dailyStreak + data.gamesPlayedToday)
      
      setStreakData(data)
      onStreakUpdate(data)
    }
  }, [playerAddress, onStreakUpdate])

  // Save streak data to localStorage
  useEffect(() => {
    if (!playerAddress) return
    localStorage.setItem(`${STORAGE_KEY}-${playerAddress}`, JSON.stringify(streakData))
  }, [streakData, playerAddress])

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

  return (
    <Container>
      <Title>🔥 Daily Streak System</Title>
      
      <StreakDisplay>
        <StatCard>
          <StatValue highlight={streakData.dailyStreak > 0}>
            {streakData.dailyStreak}
          </StatValue>
          <StatLabel>Day Streak</StatLabel>
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
        <small>Base: 1 + Streak: {streakData.dailyStreak} + Games: {streakData.gamesPlayedToday}</small>
      </CapacityInfo>

      <StreakBonus show={streakData.dailyStreak >= 3}>
        🔥 {streakData.dailyStreak} Day Streak! Bonus painting power!
      </StreakBonus>

      {gamesRemaining <= 0 && (
        <div style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '0.8rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          marginTop: '1rem',
          color: '#FF6B6B'
        }}>
          ⏰ Daily limit reached! Come back tomorrow for more games.
        </div>
      )}

      <div style={{
        fontSize: '0.8rem',
        opacity: 0.6,
        textAlign: 'center',
        marginTop: '1rem',
        lineHeight: 1.4
      }}>
        💡 Play daily to build your streak and increase painting capacity!
        <br />
        Max capacity: 10 territories per game
      </div>
    </Container>
  )
}



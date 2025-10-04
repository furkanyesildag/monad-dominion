import { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'

// Initialize Upstash Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

interface GameRoom {
  id: string
  players: Array<{
    username: string
    address: string
    joinedAt: number
  }>
  maxPlayers: number
  gameStarted: boolean
  createdAt: number
}

// Helper functions for Upstash Redis
async function getRooms(): Promise<GameRoom[]> {
  try {
    const roomIds = await redis.smembers('active_rooms') || []
    const rooms: GameRoom[] = []
    
    for (const roomId of roomIds) {
      const room = await redis.get(`room:${roomId}`) as GameRoom | null
      if (room) {
        rooms.push(room)
      }
    }
    
    return rooms
  } catch (error) {
    console.error('Error getting rooms:', error)
    return []
  }
}

async function saveRoom(room: GameRoom): Promise<void> {
  try {
    await redis.set(`room:${room.id}`, room)
    await redis.sadd('active_rooms', room.id)
    // Set expiration for 10 minutes
    await redis.expire(`room:${room.id}`, 600)
  } catch (error) {
    console.error('Error saving room:', error)
  }
}

async function deleteRoom(roomId: string): Promise<void> {
  try {
    await redis.del(`room:${roomId}`)
    await redis.srem('active_rooms', roomId)
  } catch (error) {
    console.error('Error deleting room:', error)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, address } = req.body

  if (!username || !address) {
    return res.status(400).json({ error: 'Username and address required' })
  }

  try {
    const now = Date.now()
    
    // Get all active rooms
    const rooms = await getRooms()
    
    // Clean up old rooms (older than 10 minutes)
    for (const room of rooms) {
      if (now - room.createdAt > 10 * 60 * 1000) {
        await deleteRoom(room.id)
      }
    }

    // Find available room
    let targetRoom = null
    const activeRooms = await getRooms()
    
    for (const room of activeRooms) {
      if (room.players.length < room.maxPlayers && !room.gameStarted) {
        targetRoom = room
        break
      }
    }

    // Create new room if none available
    if (!targetRoom) {
      const roomId = `REAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      targetRoom = {
        id: roomId,
        players: [],
        maxPlayers: 4,
        gameStarted: false,
        createdAt: now
      }
    }

    // Check if player already in room
    const existingPlayer = targetRoom.players.find(p => p.address === address)
    if (!existingPlayer) {
      targetRoom.players.push({
        username,
        address,
        joinedAt: now
      })
    }

    // Save updated room
    await saveRoom(targetRoom)

    res.status(200).json({
      success: true,
      room: {
        id: targetRoom.id,
        playerCount: targetRoom.players.length,
        maxPlayers: targetRoom.maxPlayers,
        players: targetRoom.players.map(p => p.username),
        gameStarted: targetRoom.gameStarted
      }
    })
  } catch (error) {
    console.error('Error joining room:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

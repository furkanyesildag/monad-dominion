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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roomId } = req.query

  if (req.method === 'GET') {
    // Get room status
    try {
      const room = await redis.get(`room:${roomId}`) as GameRoom | null
      if (!room) {
        return res.status(404).json({ error: 'Room not found' })
      }

      res.status(200).json({
        success: true,
        room: {
          id: room.id,
          playerCount: room.players.length,
          maxPlayers: room.maxPlayers,
          players: room.players.map(p => p.username),
          gameStarted: room.gameStarted
        }
      })
    } catch (error) {
      console.error('Error getting room:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    // Leave room
    try {
      const { address } = req.body
      const room = await redis.get(`room:${roomId}`) as GameRoom | null
      
      if (room) {
        room.players = room.players.filter(p => p.address !== address)
        
        if (room.players.length === 0) {
          // Delete empty room
          await redis.del(`room:${roomId}`)
          await redis.srem('active_rooms', roomId as string)
        } else {
          // Update room with remaining players
          await redis.set(`room:${roomId}`, room)
        }
      }

      res.status(200).json({ success: true })
    } catch (error) {
      console.error('Error leaving room:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export interface Player {
  username: string
  address: string
  joinedAt: number
}

export interface RoomData {
  roomId: string
  playerCount: number
  maxPlayers: number
  players: string[]
  gameStarted: boolean
}

export class VercelMultiplayer {
  private roomId: string | null = null
  private pollInterval: NodeJS.Timeout | null = null
  private isPolling = false
  private currentAddress: string | null = null
  
  // Event handlers
  public onRoomJoined: ((data: RoomData) => void) | null = null
  public onRoomUpdated: ((data: RoomData) => void) | null = null
  public onRoomReady: ((data: { roomId: string; message: string }) => void) | null = null
  public onJoinFailed: ((data: { message: string }) => void) | null = null
  public onConnectionStatusChanged: ((connected: boolean) => void) | null = null

  async joinRealMatch(username: string, address: string): Promise<boolean> {
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, address }),
      })

      const data = await response.json()

      if (!response.ok) {
        this.onJoinFailed?.({ message: data.error || 'Failed to join room' })
        return false
      }

      this.roomId = data.room.id
      this.currentAddress = address
      this.onRoomJoined?.(data.room)

      // Start polling for updates
      this.startPolling()

      return true
    } catch (error) {
      console.error('Error joining room:', error)
      this.onJoinFailed?.({ message: 'Network error' })
      return false
    }
  }

  private startPolling() {
    if (this.isPolling || !this.roomId) return

    this.isPolling = true
    this.onConnectionStatusChanged?.(true)

    this.pollInterval = setInterval(async () => {
      if (!this.roomId) {
        this.stopPolling()
        return
      }

      try {
        const response = await fetch(`/api/rooms/${this.roomId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            // Room no longer exists
            this.stopPolling()
            return
          }
          throw new Error('Failed to fetch room status')
        }

        const data = await response.json()
        this.onRoomUpdated?.(data.room)

        // Check if room is ready
        if (data.room.playerCount >= data.room.maxPlayers && !data.room.gameStarted) {
          this.onRoomReady?.({
            roomId: data.room.id,
            message: 'Room is full! All players can now start the game.'
          })
        }
      } catch (error) {
        console.error('Polling error:', error)
        // Continue polling even on errors
      }
    }, 2000) // Poll every 2 seconds
  }

  private stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }
    this.isPolling = false
    this.onConnectionStatusChanged?.(false)
  }

  async leaveRoom(): Promise<boolean> {
    if (!this.roomId) return false

    try {
      const response = await fetch(`/api/rooms/${this.roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: this.currentAddress }),
      })

      this.stopPolling()
      this.roomId = null

      return response.ok
    } catch (error) {
      console.error('Error leaving room:', error)
      return false
    }
  }

  startGame(): boolean {
    // In polling system, game start would be handled by API
    return true
  }

  disconnect() {
    this.stopPolling()
    this.roomId = null
  }

  isConnected(): boolean {
    return this.isPolling
  }
}

// Singleton instance
let vercelMultiplayer: VercelMultiplayer | null = null

export function getVercelMultiplayer(): VercelMultiplayer {
  if (!vercelMultiplayer) {
    vercelMultiplayer = new VercelMultiplayer()
  }
  return vercelMultiplayer
}

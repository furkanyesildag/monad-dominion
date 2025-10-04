export interface Player {
  username: string
  address: string
  joinedAt: number
}

export interface RoomData {
  roomId: string
  playerCount: number
  maxPlayers: number
  players: Player[]
}

export interface WebSocketMessage {
  type: string
  data: any
}

export class MultiplayerClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  
  // Event handlers
  public onRoomJoined: ((data: RoomData) => void) | null = null
  public onRoomUpdated: ((data: RoomData) => void) | null = null
  public onRoomReady: ((data: { roomId: string; message: string }) => void) | null = null
  public onGameStarted: ((data: { roomId: string; startTime: number }) => void) | null = null
  public onJoinFailed: ((data: { message: string }) => void) | null = null
  public onConnectionStatusChanged: ((connected: boolean) => void) | null = null

  constructor(private serverUrl: string = 'ws://localhost:8080') {}

  connect(): Promise<boolean> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve(true)
    }

    this.isConnecting = true

    return new Promise((resolve, reject) => {
      try {
        console.log('🔌 Connecting to WebSocket server:', this.serverUrl)
        this.ws = new WebSocket(this.serverUrl)

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.onConnectionStatusChanged?.(true)
          resolve(true)
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            console.log('📨 Received message:', message)
            this.handleMessage(message)
          } catch (error) {
            console.error('❌ Error parsing message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false
          this.onConnectionStatusChanged?.(false)
          
          // Auto-reconnect if not a clean close
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error)
          this.isConnecting = false
          this.onConnectionStatusChanged?.(false)
          reject(error)
        }

        // Connection timeout
        setTimeout(() => {
          if (this.isConnecting) {
            this.isConnecting = false
            reject(new Error('Connection timeout'))
          }
        }, 10000)

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private scheduleReconnect() {
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)
    
    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch(console.error)
      }
    }, delay)
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'ROOM_JOINED':
        this.onRoomJoined?.(message.data)
        break
      
      case 'ROOM_UPDATED':
        this.onRoomUpdated?.(message.data)
        break
      
      case 'ROOM_READY':
        this.onRoomReady?.(message.data)
        break
      
      case 'GAME_STARTED':
        this.onGameStarted?.(message.data)
        break
      
      case 'JOIN_FAILED':
        this.onJoinFailed?.(message.data)
        break
      
      case 'PONG':
        // Handle ping/pong for connection health
        break
      
      default:
        console.log('❓ Unknown message type:', message.type)
    }
  }

  joinRealMatch(username: string, address: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected')
      return false
    }

    const message: WebSocketMessage = {
      type: 'JOIN_REAL_MATCH',
      data: { username, address }
    }

    console.log('📤 Sending join match request:', message)
    this.ws.send(JSON.stringify(message))
    return true
  }

  leaveRoom(): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected')
      return false
    }

    const message: WebSocketMessage = {
      type: 'LEAVE_ROOM',
      data: {}
    }

    console.log('📤 Sending leave room request')
    this.ws.send(JSON.stringify(message))
    return true
  }

  startGame(): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('❌ WebSocket not connected')
      return false
    }

    const message: WebSocketMessage = {
      type: 'START_GAME',
      data: {}
    }

    console.log('📤 Sending start game request')
    this.ws.send(JSON.stringify(message))
    return true
  }

  ping(): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false
    }

    this.ws.send(JSON.stringify({ type: 'PING' }))
    return true
  }

  disconnect() {
    if (this.ws) {
      console.log('🔌 Disconnecting WebSocket')
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let multiplayerClient: MultiplayerClient | null = null

export function getMultiplayerClient(): MultiplayerClient {
  if (!multiplayerClient) {
    multiplayerClient = new MultiplayerClient()
  }
  return multiplayerClient
}

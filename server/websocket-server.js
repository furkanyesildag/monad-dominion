const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Game rooms storage
const rooms = new Map();
const playerSockets = new Map();

// Room class
class GameRoom {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.maxPlayers = 4;
    this.gameStarted = false;
    this.createdAt = Date.now();
  }

  addPlayer(player) {
    if (this.players.length >= this.maxPlayers) {
      return false;
    }
    
    // Check if player already exists
    const existingPlayer = this.players.find(p => p.address === player.address);
    if (existingPlayer) {
      return false;
    }

    this.players.push(player);
    return true;
  }

  removePlayer(address) {
    this.players = this.players.filter(p => p.address !== address);
  }

  isFull() {
    return this.players.length >= this.maxPlayers;
  }

  isEmpty() {
    return this.players.length === 0;
  }

  toJSON() {
    return {
      id: this.id,
      players: this.players,
      maxPlayers: this.maxPlayers,
      gameStarted: this.gameStarted,
      createdAt: this.createdAt
    };
  }
}

// Broadcast to all players in a room
function broadcastToRoom(roomId, message) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.players.forEach(player => {
    const socket = playerSockets.get(player.address);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  });
}

// Find or create room for player
function findOrCreateRoom() {
  // Find available room
  for (const [roomId, room] of rooms) {
    if (!room.isFull() && !room.gameStarted) {
      return room;
    }
  }

  // Create new room
  const roomId = `REAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const room = new GameRoom(roomId);
  rooms.set(roomId, room);
  return room;
}

// Clean up old empty rooms
function cleanupRooms() {
  const now = Date.now();
  for (const [roomId, room] of rooms) {
    // Remove empty rooms older than 5 minutes
    if (room.isEmpty() && (now - room.createdAt) > 5 * 60 * 1000) {
      rooms.delete(roomId);
      console.log(`🧹 Cleaned up empty room: ${roomId}`);
    }
  }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection');
  
  let currentPlayer = null;
  let currentRoom = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('📨 Received:', message);

      switch (message.type) {
        case 'JOIN_REAL_MATCH':
          const { username, address } = message.data;
          
          // Store player socket
          playerSockets.set(address, ws);
          
          // Create player object
          currentPlayer = {
            username,
            address,
            joinedAt: Date.now()
          };

          // Find or create room
          const room = findOrCreateRoom();
          const added = room.addPlayer(currentPlayer);
          
          if (added) {
            currentRoom = room;
            
            // Send room joined confirmation
            ws.send(JSON.stringify({
              type: 'ROOM_JOINED',
              data: {
                roomId: room.id,
                playerCount: room.players.length,
                maxPlayers: room.maxPlayers,
                players: room.players
              }
            }));

            // Broadcast room update to all players in room
            broadcastToRoom(room.id, {
              type: 'ROOM_UPDATED',
              data: {
                roomId: room.id,
                playerCount: room.players.length,
                maxPlayers: room.maxPlayers,
                players: room.players
              }
            });

            console.log(`👥 Player ${username} joined room ${room.id} (${room.players.length}/${room.maxPlayers})`);

            // If room is full, notify all players
            if (room.isFull()) {
              broadcastToRoom(room.id, {
                type: 'ROOM_READY',
                data: {
                  roomId: room.id,
                  message: 'Room is full! All players can now start the game.'
                }
              });
              console.log(`🎉 Room ${room.id} is full and ready!`);
            }
          } else {
            ws.send(JSON.stringify({
              type: 'JOIN_FAILED',
              data: { message: 'Could not join room' }
            }));
          }
          break;

        case 'LEAVE_ROOM':
          if (currentPlayer && currentRoom) {
            currentRoom.removePlayer(currentPlayer.address);
            playerSockets.delete(currentPlayer.address);

            // Broadcast room update
            broadcastToRoom(currentRoom.id, {
              type: 'ROOM_UPDATED',
              data: {
                roomId: currentRoom.id,
                playerCount: currentRoom.players.length,
                maxPlayers: currentRoom.maxPlayers,
                players: currentRoom.players
              }
            });

            console.log(`👋 Player ${currentPlayer.username} left room ${currentRoom.id}`);

            // Clean up empty room
            if (currentRoom.isEmpty()) {
              rooms.delete(currentRoom.id);
              console.log(`🗑️ Deleted empty room: ${currentRoom.id}`);
            }

            currentPlayer = null;
            currentRoom = null;
          }
          break;

        case 'START_GAME':
          if (currentRoom && currentRoom.isFull()) {
            currentRoom.gameStarted = true;
            
            broadcastToRoom(currentRoom.id, {
              type: 'GAME_STARTED',
              data: {
                roomId: currentRoom.id,
                startTime: Date.now()
              }
            });

            console.log(`🎮 Game started in room ${currentRoom.id}`);
          }
          break;

        case 'PING':
          ws.send(JSON.stringify({ type: 'PONG' }));
          break;

        default:
          console.log('❓ Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
    
    // Clean up player
    if (currentPlayer && currentRoom) {
      currentRoom.removePlayer(currentPlayer.address);
      playerSockets.delete(currentPlayer.address);

      // Broadcast room update
      broadcastToRoom(currentRoom.id, {
        type: 'ROOM_UPDATED',
        data: {
          roomId: currentRoom.id,
          playerCount: currentRoom.players.length,
          maxPlayers: currentRoom.maxPlayers,
          players: currentRoom.players
        }
      });

      // Clean up empty room
      if (currentRoom.isEmpty()) {
        rooms.delete(currentRoom.id);
        console.log(`🗑️ Deleted empty room: ${currentRoom.id}`);
      }
    }
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Cleanup interval
setInterval(cleanupRooms, 60000); // Every minute

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`🎮 Monad Dominion Multiplayer Server Ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
});

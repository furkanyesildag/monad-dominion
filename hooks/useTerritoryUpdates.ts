import { useEffect, useState } from 'react'
import { useContractEvent, usePublicClient } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/config'

interface TerritoryUpdate {
  territoryId: number
  factionId: number
  player: string
  timestamp: number
}

interface UseTerritoryUpdatesProps {
  onTerritoryUpdate: (update: TerritoryUpdate) => void
}

export function useTerritoryUpdates({ onTerritoryUpdate }: UseTerritoryUpdatesProps) {
  const [updates, setUpdates] = useState<TerritoryUpdate[]>([])
  const publicClient = usePublicClient()

  // Listen for TerritoryClaimed events
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'TerritoryClaimed',
    listener: (logs) => {
      logs.forEach((log) => {
        const update: TerritoryUpdate = {
          territoryId: Number(log.args.territoryId),
          factionId: Number(log.args.factionId),
          player: log.args.player || '',
          timestamp: Date.now()
        }
        
        setUpdates(prev => [update, ...prev.slice(0, 49)]) // Keep last 50 updates
        onTerritoryUpdate(update)
      })
    },
  })

  // Listen for FactionJoined events
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'FactionJoined',
    listener: (logs) => {
      logs.forEach((log) => {
        console.log(`Player ${log.args.player} joined faction ${log.args.factionId}`)
      })
    },
  })

  return { updates }
}

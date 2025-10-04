// Transaction utilities for Monad network
export interface TransactionParams {
  from: string
  to: string
  value: string
  data?: string
}

// Clear stuck transactions by sending a 0 ETH transaction to self
export async function clearStuckTransactions(address: string): Promise<void> {
  if (!window.ethereum) return
  
  try {
    console.log('Clearing stuck transactions...')
    
    // Get latest confirmed nonce
    const latestNonce = await window.ethereum.request({
      method: 'eth_getTransactionCount',
      params: [address, 'latest']
    })
    
    // Send 0 ETH to self with high gas to clear nonce
    await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: address,
        to: address,
        value: '0x0',
        gas: '0x5208', // 21000 gas for simple transfer
        gasPrice: '0x174876E800', // 100 gwei - high priority
        nonce: latestNonce,
      }]
    })
    
    console.log('Nonce clearing transaction sent')
    
    // Wait for clearing transaction to be mined
    await new Promise(resolve => setTimeout(resolve, 5000))
    
  } catch (error) {
    console.warn('Failed to clear stuck transactions:', error)
  }
}

export async function sendMonadTransaction(params: TransactionParams): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask not found')
  }

  try {
    // Use same high gas settings as fix nonce (which works!)
    const result = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: params.from,
        to: params.to,
        value: params.value,
        gas: '0x249F0', // 150000 gas (same as before, higher for safety)
        gasPrice: '0x174876E800', // 100 gwei - same as fix nonce
        data: params.data || '0x'
      }]
    })

    console.log('Monad transaction sent:', result)
    return result
  } catch (error: any) {
    console.error('Monad transaction failed:', error)
    
    // Enhanced error messages for Monad-specific issues
    if (error.code === 4001) {
      throw new Error('Transaction cancelled by user')
    } else if (error.message?.includes('insufficient funds')) {
      throw new Error('Insufficient MON balance for transaction and gas fees')
    } else if (error.message?.includes('gas')) {
      throw new Error('Gas estimation failed. Try increasing gas price.')
    } else if (error.message?.includes('dropped') || error.message?.includes('replaced')) {
      throw new Error('Transaction nonce conflict. Please use "Fix Nonce" button.')
    } else {
      throw error
    }
  }
}

// Monad-specific gas configurations
export const MONAD_GAS_CONFIG = {
  // Minimum gas price for Monad (50 gwei)
  MIN_GAS_PRICE: '0xBA43B7400', // 50 gwei in hex
  MIN_GAS_PRICE_GWEI: 50,
  
  // Standard transfer
  TRANSFER: {
    gasLimit: 21000,
    gasPrice: '0xBA43B7400', // 50 gwei (minimum for Monad)
  },
  // Contract interaction
  CONTRACT: {
    gasLimit: 200000,
    gasPrice: '0xBA43B7400', // 50 gwei
  },
  // Complex operations
  COMPLEX: {
    gasLimit: 500000,
    gasPrice: '0xBA43B7400', // 50 gwei
  }
}

// Helper to convert wei to gwei
export function weiToGwei(wei: string): number {
  return parseInt(wei, 16) / 1e9
}

// Helper to convert gwei to wei hex
export function gweiToWeiHex(gwei: number): string {
  return `0x${(gwei * 1e9).toString(16)}`
}

// Check if user has sufficient balance
export async function checkBalance(address: string, requiredAmount: string): Promise<boolean> {
  if (!window.ethereum) return false
  
  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    })
    
    const balanceWei = parseInt(balance, 16)
    const requiredWei = parseInt(requiredAmount, 16)
    
    return balanceWei >= requiredWei
  } catch (error) {
    console.error('Balance check failed:', error)
    return false
  }
}

// Format balance for display
export function formatBalance(balanceWei: string): string {
  const balance = parseInt(balanceWei, 16) / 1e18
  return balance.toFixed(4)
}

// Switch to Monad Testnet
export async function switchToMonadTestnet(): Promise<boolean> {
  if (!window.ethereum) return false

  try {
    // Try to switch to Monad Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x279F' }], // 10143 in hex
    })
    return true
  } catch (switchError: any) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x279F',
              chainName: 'Monad Testnet',
              nativeCurrency: {
                name: 'Monad',
                symbol: 'MON',
                decimals: 18,
              },
              rpcUrls: ['https://testnet-rpc.monad.xyz'],
              blockExplorerUrls: ['https://testnet.monadscan.com'],
            },
          ],
        })
        return true
      } catch (addError) {
        console.error('Failed to add Monad network:', addError)
        return false
      }
    }
    console.error('Failed to switch to Monad network:', switchError)
    return false
  }
}

// Check if user is on Monad Testnet
export async function isOnMonadTestnet(): Promise<boolean> {
  if (!window.ethereum) return false

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return chainId === '0x279F' // 10143 in hex
  } catch (error) {
    console.error('Failed to get chain ID:', error)
    return false
  }
}

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    {
      id: 10143,
      name: 'Monad Testnet',
      network: 'monad-testnet',
      nativeCurrency: {
        decimals: 18,
        name: 'Monad',
        symbol: 'MON',
      },
    rpcUrls: {
      default: {
        http: ['https://testnet-rpc.monad.xyz'],
      },
      public: {
        http: ['https://testnet-rpc.monad.xyz'],
      },
    },
      blockExplorers: {
        default: { name: 'MonadScan', url: 'https://testnet.monadscan.com' },
        monadexplorer: { name: 'MonadExplorer', url: 'https://testnet.monadexplorer.com' },
        socialscan: { name: 'SocialScan', url: 'https://monad-testnet.socialscan.io' },
      },
      testnet: true,
    },
  ],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Monad Dominion',
  projectId: 'monad-dominion-game',
  chains,
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

import { http, createConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { defineChain } from 'viem';

// Define local Anvil chain (forked Polygon)
const anvilLocal = defineChain({
  id: 31337,
  name: 'Anvil Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

// Determine if we're using local node
const useLocalNode = process.env.NEXT_PUBLIC_USE_LOCAL_NODE === 'true';

console.log('useLocalNode', useLocalNode);
// Create config based on environment
export const config = useLocalNode
  ? createConfig({
      chains: [anvilLocal],
      transports: {
        [anvilLocal.id]: http('http://127.0.0.1:8545'),
      },
    })
  : createConfig({
      chains: [polygon],
      transports: {
        [polygon.id]: http(
          `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
        ),
      },
    });

// Export the active chain for easy access
export const activeChain = useLocalNode ? anvilLocal : polygon;

import { http, createConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(
      `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
    ),
  },
});


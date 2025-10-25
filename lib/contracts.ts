// Contract addresses on Polygon
export const MATCHBOX_FACTORY_ADDRESS = (process.env
  .NEXT_PUBLIC_MATCHBOX_FACTORY_ADDRESS || '') as `0x${string}`;
export const MATCHBOX_ROUTER_ADDRESS = (process.env
  .NEXT_PUBLIC_MATCHBOX_ROUTER_ADDRESS || '') as `0x${string}`;
export const CTF_ADDRESS = (process.env.NEXT_PUBLIC_CTF_ADDRESS ||
  '') as `0x${string}`;

// Import ABIs
import MatchboxABI from '../abi/Matchbox.json';
import MatchboxFactoryABI from '../abi/MatchboxFactory.json';
import MatchboxRouterABI from '../abi/MatchboxRouter.json';

export const ABIS = {
  Matchbox: MatchboxABI.abi,
  MatchboxFactory: MatchboxFactoryABI.abi,
  MatchboxRouter: MatchboxRouterABI.abi,
} as const;


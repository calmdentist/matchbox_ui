// Contract types for Matchbox Protocol

export type Rule = {
  conditionId: `0x${string}`;
  outcomeIndex: bigint;
  minPrice: bigint;
  maxPrice: bigint;
  useAllFunds: boolean;
  specificAmount: bigint;
};

export type Leg = {
  id: string;
  market: string; // This will be the conditionId
  outcome: 'YES' | 'NO';
  amount: string;
  maxPrice: string;
  minPrice: string;
  isInitial: boolean;
};

export type MatchboxDeployment = {
  address: `0x${string}`;
  owner: `0x${string}`;
  txHash: `0x${string}`;
};


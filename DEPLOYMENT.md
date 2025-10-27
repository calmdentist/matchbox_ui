# Matchbox Client Deployment Guide

## Core Functionality Implementation Status

### ✅ Completed

- **Contract Integration**: Full integration with Matchbox smart contracts (Factory, Matchbox, Router)
- **Vault Deployment**: Deploy personal non-custodial Matchbox vaults via MatchboxFactory
- **Sequence Initialization**: Initialize multi-leg conditional sequences with price constraints
- **Wallet Connection**: Privy-based authentication with wagmi hooks
- **Transaction Tracking**: Real-time transaction status and receipt parsing
- **User Interface**: Complete UI for designing and deploying Matchbox sequences

### 🚧 To Be Implemented

1. **Execute First Step**: Need to implement `executeFirstStep` with order data generation
2. **Polymarket API Integration**: Fetch markets and conditionIds programmatically
3. **Chainlink Automation Setup**: Register Matchbox vaults with Chainlink Automation
4. **Vault Management Dashboard**: View and manage existing Matchboxes
5. **Order Data Generation**: Create utility to generate order data for Router calls

## Environment Variables

Create a `.env.local` file with the following:

```bash
# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# RPC Provider
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key

# Matchbox Contracts on Polygon
NEXT_PUBLIC_MATCHBOX_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_MATCHBOX_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_CTF_ADDRESS=0x4D97DCd97eC945f40cF65F87097ACe5EA0476045
```

## Contract Addresses

### Polygon Mainnet

- **CTF (Polymarket)**: `0x4D97DCd97eC945f40cF65F87097ACe5EA0476045`
- **MatchboxFactory**: TBD (deploy your contracts)
- **MatchboxRouter**: TBD (deploy your contracts)

## Architecture

### File Structure

```
lib/
  ├── types.ts              # TypeScript types for Matchbox protocol
  ├── contracts.ts          # Contract ABIs and addresses
  ├── wagmi.ts              # Wagmi configuration
  ├── utils.ts              # Utility functions (leg conversion, validation)
  └── hooks/
      ├── useMatchboxFactory.ts  # Factory hooks (create, list vaults)
      └── useMatchbox.ts         # Matchbox instance hooks (initialize, execute, withdraw)

app/
  ├── page.tsx              # Main UI for building Matchbox sequences
  ├── providers.tsx         # Privy + Wagmi providers
  └── components/           # UI components (Header, Footer, etc.)
```

### Contract Interaction Flow

1. **Deploy Vault**:
   ```typescript
   const { createMatchbox, deployedAddress } = useCreateMatchbox();
   await createMatchbox();
   // deployedAddress is automatically parsed from transaction receipt
   ```

2. **Initialize Sequence**:
   ```typescript
   const { initializeSequence } = useInitializeSequence(matchboxAddress);
   const rules: Rule[] = legs.map(legToRule);
   await initializeSequence(rules);
   ```

3. **Execute First Step** (TODO):
   ```typescript
   const { executeFirstStep } = useExecuteFirstStep(matchboxAddress);
   await executeFirstStep(amountInUSDC, orderData);
   ```

## Rule Structure

A `Rule` in the Matchbox contract has the following structure:

```typescript
type Rule = {
  conditionId: `0x${string}`;    // Polymarket market conditionId (bytes32)
  outcomeIndex: bigint;          // 0 for NO, 1 for YES
  minPrice: bigint;              // Min price in wei (18 decimals)
  maxPrice: bigint;              // Max price in wei (18 decimals)
  useAllFunds: boolean;          // Use all proceeds from previous step
  specificAmount: bigint;        // Specific amount if not using all funds
};
```

### Example

```typescript
// "Buy YES on Market A for max $0.50"
{
  conditionId: "0x1234...",
  outcomeIndex: 1n,              // YES
  minPrice: parseUnits("0.10", 18),
  maxPrice: parseUnits("0.50", 18),
  useAllFunds: true,             // Use all funds from previous step
  specificAmount: 0n
}
```

## Next Steps

1. **Deploy Contracts**: Deploy MatchboxFactory and MatchboxRouter to Polygon
2. **Configure Environment**: Add contract addresses to `.env.local`
3. **Test Deployment**: Try deploying a test Matchbox vault
4. **Implement Execute**: Add `executeFirstStep` functionality with order data
5. **Add Chainlink**: Integrate Chainlink Automation for automatic step execution

## Development

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build

# Run production server
bun start
```

## Testing Checklist

- [ ] Wallet connection works
- [ ] Can create new Matchbox vault
- [ ] Transaction receipt parses deployed address correctly
- [ ] Sequence initialization succeeds
- [ ] View deployed Matchboxes for user
- [ ] Validation prevents invalid sequences
- [ ] Error messages display correctly
- [ ] Transaction links to Polygonscan work

## Resources

- [Matchbox Architecture](./architecture.md)
- [Matchbox Whitepaper](./matchbox.tex)
- [Polymarket CTF Docs](https://docs.polymarket.com/)
- [Privy Docs](https://docs.privy.io/)
- [Wagmi Docs](https://wagmi.sh/)


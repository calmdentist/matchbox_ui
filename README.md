# Matchbox

A non-custodial, decentralized automation layer for prediction markets. Matchbox enables users to create complex conditional wagers (parlays, if-then bets) by routing funds to existing liquid markets instead of creating new, illiquid markets for every conditional outcome.

## What is Matchbox?

Matchbox solves the combinatorial liquidity trap in decentralized prediction markets. Instead of creating a new market for every parlay (e.g., "YES on A and YES on B"), Matchbox provides a trustless "if-then" execution router that executes a sequence of trades against existing, liquid underlying markets like Polymarket.

### Key Features

- **Non-Custodial**: Users deploy their own personal smart contract vault. Only you can withdraw funds.
- **Conditional Execution**: Define multi-leg sequences that execute only if previous markets resolve in your favor.
- **Price Constraints**: Set maximum and minimum prices to protect against volatility and ensure fixed minimum payouts.
- **Automated**: Powered by decentralized automation networks (e.g., Chainlink Automation).

## This Client

This is the **Design Layer** (dApp) - a Next.js frontend that provides a no-code interface for users to browse markets and design their conditional sequences. The dApp helps users deploy their personal Matchbox vault and configure automation triggers.

## Getting Started

Run the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to build your first Matchbox.

## Architecture

The Matchbox protocol consists of three layers:

1. **Design Layer (This dApp)**: User-friendly interface for building conditional sequences
2. **Logic Layer (Smart Contracts)**: Non-custodial vaults and factory contracts
3. **Execution Layer (Automation)**: Decentralized triggers and routing to underlying markets

For more details, see `architecture.md` and `matchbox.tex`.

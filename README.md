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

### Prerequisites

- Node.js 18+ or Bun
- A Privy account (for wallet authentication) - [privy.io](https://privy.io/)
- An Infura account (for RPC access) - [infura.io](https://infura.io/)

### Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here

# Network Configuration
# Set to 'true' to use local Anvil node, omit or set to 'false' for Polygon mainnet
NEXT_PUBLIC_USE_LOCAL_NODE=false

# Infura RPC Endpoint (only needed for Polygon mainnet)
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key_here

# Matchbox Contract Addresses
# Use local addresses when NEXT_PUBLIC_USE_LOCAL_NODE=true
# Use production addresses when on Polygon mainnet
NEXT_PUBLIC_MATCHBOX_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_MATCHBOX_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_CTF_ADDRESS=0x...
```

### Installation & Running

```bash
# Install dependencies
npm install
# or
bun install

# Run the development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to build your first Matchbox.

### Local Development with Anvil

To develop and test locally using Anvil (forked Polygon with Polymarket contracts):

1. **Start Anvil** with a Polygon fork:
```bash
anvil --fork-url https://polygon-rpc.com
```

2. **Deploy contracts** to your local node (use your deployment scripts)

3. **Update `.env.local`** with local configuration:
```bash
NEXT_PUBLIC_USE_LOCAL_NODE=true
NEXT_PUBLIC_MATCHBOX_FACTORY_ADDRESS=0x... # Your local deployment
NEXT_PUBLIC_MATCHBOX_ROUTER_ADDRESS=0x...  # Your local deployment
NEXT_PUBLIC_CTF_ADDRESS=0x...              # Your local deployment
```

4. **Run the dev server**:
```bash
npm run dev
```

The app will automatically connect to your local Anvil node at `http://127.0.0.1:8545` (chain ID 31337).

## How to Use

1. **Connect Your Wallet**: Click "Login" in the header to connect via Privy
2. **Design Your Sequence**: 
   - **Select a Market**: Simply paste a Polymarket URL (e.g., `https://polymarket.com/event/trump-wins-2024`)
   - The app will automatically fetch the market details and conditionId
   - **Choose Outcome**: Select YES or NO
   - **Set Amount**: Enter USDC amount for the initial leg
   - **Set Price Constraints**: Define min/max prices to protect against volatility and ensure fixed minimum payouts
3. **Add Conditional Legs**: Click "+ ADD CONDITIONAL LEG" to create multi-step parlays
4. **Deploy**: Click "DEPLOY MATCHBOX" to create your personal vault and initialize the sequence

### Finding Polymarket Markets

It's super simple now:

1. Go to [Polymarket](https://polymarket.com)
2. Find a market you want to bet on
3. Copy the URL from your browser (e.g., `https://polymarket.com/event/will-bitcoin-hit-100k`)
4. Paste it into the market field in Matchbox
5. The app automatically fetches all the market details for you!

### Current Limitations

- Order data for first step execution needs to be generated separately (integration with MatchboxRouter coming soon)
- Chainlink Automation setup must be done manually after deployment

## Architecture

The Matchbox protocol consists of three layers:

1. **Design Layer (This dApp)**: User-friendly interface for building conditional sequences
2. **Logic Layer (Smart Contracts)**: Non-custodial vaults and factory contracts
3. **Execution Layer (Automation)**: Decentralized triggers and routing to underlying markets

For more details, see `architecture.md` and `matchbox.tex`.

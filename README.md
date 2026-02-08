# Street Ledger
> **Formalizing Social Trust. Unlocking Street Liquidity.**

**Street Ledger** is a high-performance, **Rust-powered** financial protocol designed to capture and scale the untapped liquidity of the world’s informal economies. By transforming Peer-to-Peer (P2P) social trust into verifiable, on-chain assets, we provide the "unbanked" with a cryptographic reputation that bridges the gap between the street and global DeFi.

---

## The Vision
In the Global South, billions circulate in "handshake" credit—from local spaza shop tabs to community micro-loans. This value is currently invisible to global finance. Street Ledger provides the infrastructure to record, verify, and leverage this trust, allowing a vendor in Johannesburg to access the same financial integrity tools as an institutional trader.

## Core Innovation: The Trust Prediction Engine
The heart of the protocol is our proprietary Trust Prediction Engine, built in Rust for high-integrity calculations. It quantifies trust through two distinct lenses:

**Community Status (Social Endorsements)**: Qualatative trust built via "vouches" from respected community members. This ensures that even without a long history, a user's reputation is backed by their network.

**Payment Pace (Repayment Velocity)**: Quantitative trust based on the real-time speed of debt settlement. We track how fast money moves, turning "reliability" into a measurable metric.

---

## Tech Stack
Built for extreme performance and absolute security using a Rust-centric architecture:

### Sui Network (The Asset Layer) | $10k Track
**Object-Centric Logic**: Every debt relationship is minted as a unique, high-integrity Move object. Unlike static ledgers, these are programmable assets that can be split, traded, or bundled.

Killer Feature: Instant Cash-Out (Debt Factoring): Shopkeepers can "sell" their pending ledger objects to local liquidators for instant cash, solving the cash-flow crisis of the informal market.

### Arch Network (The Bitcoin Security Layer) | $10k Track
**Bitcoin-Backed Integrity**: We leverage Arch’s Rust-based ZKVM to anchor our Trust Prediction proofs directly to the Bitcoin blockchain.

Verifiable Reputation: Users get the security of the world’s most decentralized network, ensuring their "Street Cred" is immutable and globally recognized.

## Yellow (The Settlement Layer) | $15k Track
**Instant Stablecoin Settlement**: Integration with Yellow’s high-speed clearing house allows users to settle ledgers in USDC/PYUSD.

The Street-to-Chain Bridge: Turning digital IOUs into spendable liquidity instantly, eliminating the friction of traditional cross-border or informal payments.

---

## Project Structure

Street-Ledger/
├── contracts/        # Sui Move Smart Contracts (Debt Objects & Marketplace)
├── engine/           # Rust Core (Trust Prediction Logic & Arch ZK-Proof Generation)
├── mobile/           # Flutter Application (Human-Centric UI/UX)
├── yellow-adapter/   # Integration layer for Yellow settlement rails
└── docs/             # Visual User Journey, Architecture Diagrams & Pitch Deck

## Installation & Setup
**Prerequisites**

**Rust**: v1.75+ (Required for Arch ZKVM and Core Engine)

**Sui CLI**: For smart contract deployment

**Flutter SDK**: For the mobile interface

**Yellow Card API Keys**: (Development sandbox)

# 1. Smart Contracts(Sui/Move)

Bash
cd contracts
sui move build
sui move publish --gas-budget 100000000
# 2. The Trust Engine (Rust)

Bash
cd engine
# Install dependencies
cargo fetch
# Run the Reputation Service
cargo run --bin reputation_engine
# 3. Mobile Frontend (Flutter)
Bash
cd mobile
flutter pub get
flutter run

# 4. Web Build (Production)
flutter build web --wasm

## AI Attribution & Involvement.

## Technical Specifications
Network: Sui Testnet Package ID: 0xa1e04c7751b49820b5062a6001abe321ecd1fb37e012112a9f9ac426ab9d554f

Smart Contract Functions (API)
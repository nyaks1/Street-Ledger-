## Street Ledger: Peer-to-Peer Trust at Web2 Speed
# "Stop losing money on small favors. Record, verify, and settle informal debts instantly."

## The Vision
In the real world, informal debt (favors, lunch, small loans) is the most common financial interaction, yet it remains "invisible" to the blockchain. Street Ledger makes these interactions visible, verifiable, and settleable without the friction of high gas fees or long confirmation times. I are turning "I'll pay you back" into an immutable, programmable asset.

## The Power Trio (Technical Integration)
I have integrated three cutting-edge protocols to create a "Triple-Threat" financial application:

1. **Sui: The Source of Truth (The Ledger)**
I leverage Sui's Object-Oriented model to treat every debt as a unique, programmable Move Object.

What it does: Tracks the "Who, What, and How Much" with sub-second finality.

Why Sui: Unlike account-based chains, Sui allows parallel execution of debt requests, ensuring the ledger scales even if the whole street is using it at once.

2. **Yellow Network: The "Favor Mode" (Off-Chain Speed)**
I integrated the Yellow SDK (Nitrolite Protocol) to enable "Session-Based" interactions.

What it does: Users can open a "Favor Mode" session. During this session, you can log dozens of micro-debts (e.g., "0.50 USDC for a snack") with zero gas and zero waiting.

The Magic: These interactions happen off-chain through Yellow's state channels and only hit the blockchain when the session is closed. This provides a true Web2-native user experience.

3. **Arc (Circle): The Global Payout (USDC Settlement)**
Final settlement is handled through Circle's Arc L1, the economic engine for the internet.

What it does: When a user clicks "Settle," the net debt is calculated and a USDC payout is triggered on Arc.

Why Arc: By using Arc as our liquidity hub, we ensure that the "Street" debt is paid in a stable, global currency that can be moved anywhere in the world instantly.

## How it Works
REQUEST: A creditor sends a "Debt Request" Move object to a debtor's Sui address.

SYNC: Using the Yellow SDK, the parties enter an off-chain session where multiple adjustments can be made instantly without gas.

SETTLE: The final balance is pushed to Arc, where USDC is transferred to the creditor, and the Sui Debt Object is "Burned" (marked as settled).

## Prize Track Eligibility
SUI: Best Overall Project / Notable Project (Uses Move Objects & PTBs).

YELLOW: Best Integration of Yellow SDK/Nitrolite (Demonstrates off-chain logic & session-based spending).

ARC (CIRCLE): Best Global Payout System (Uses Arc as a liquidity hub for USDC settlement).

## Tech Stack
Frontend: React + Vite + Tailwind CSS (v4)

Blockchain: Sui (Move Smart Contracts)

Off-Chain: Yellow Network (Nitrolite SDK / ERC-7824)

Settlement: Circle Arc (USDC native)

Wallet: Slush / Sui Wallet

## AI & Contributions

This project was developed with the assistance of Gemini (AI) to accelerate the integration of the Sui dApp-kit and complex partner SDKs within a 36-hour window.

**Human Involvement (Nyakallo Masiu):**

Architecture & Logic: Designed the P2P debt ledger flow and the "Street" concept.

Smart Contract Design: Developed the Move modules on Sui for Debt objects.

Integration Strategy: Manually mapped the off-chain Yellow Network session logic to on-chain Arc/Circle payouts.

Debugging & Verification: Manually verified every transaction on SuiScan and fixed wallet-standard connection bugs.

**AI Assistance (Gemini):**

Boilerplate Generation: Assisted in generating the initial React/Tailwind UI components (Cards, Forms).

Library Migration: Helped translate outdated gRPC code into the modern @mysten/dapp-kit standard.

Technical Documentation: Accelerated the drafting of the README and partner integration guides.

## User Experience & Mass Adoption

Street Ledger eliminates the 'Web3 Tax' by utilizing Sui zkLogin for 1-click Google onboarding and Yellow Network for gasless, sub-100ms off-chain debt logging. By abstracting the blockchain, users can record 'Street Credits' instantly, with final global settlement handled in USDC via Circle's Arc. No extensions, no seed phrases—just social trust at scale.
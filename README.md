Astra — Decentralized Savings Platform

Astra is a blockchain-based decentralized savings platform designed to help users save securely on-chain, manage multiple financial goals, interact with a yield pool, and maintain transparent transaction history.

Project status: Active development — frontend and core blockchain integration are implemented. Advanced protocol novelty is currently under research and has not yet been implemented.

🚀 Current Features

Wallet & Blockchain

MetaMask wallet connection

Ethereum Sepolia Testnet integration

Ethers.js blockchain interaction

On-chain balance retrieval

Smart-contract transaction handling

Transaction status feedback and refresh

Savings

Deposit tUSDC into the Astra savings vault

Withdraw savings

Display principal and yield information

On-chain savings state

Quick deposit and withdrawal actions

My Goals

Create multiple savings goals

Set target amounts

Add savings to individual goals

Track goal progress

Withdraw goal funds

Delete goals

Goal-specific activity

Yield Pool

Display yield-pool information

Fund the yield pool with tUSDC

Show pool-related activity

Explain the pool's role in the Astra ecosystem

Record yield-pool transactions on-chain

Transactions

Complete Astra transaction history

Deposit and withdrawal transactions

Goal creation, funding, and withdrawal

Yield-pool funding

Transaction hashes and status

Blockchain explorer access

Pagination

Manual refresh

Analytics

The Analytics page derives metrics from transaction and goal activity, including:

Savings growth

Total deposited

Total withdrawn

Yield earned

Savings activity

Goal performance

Savings behavior

Yield performance

Activity score

Astra insights

Analytics is intended to provide derived information rather than duplicate the core Savings, Goals, Yield Pool, and Transactions pages.

🖥️ Current Navigation

Dashboard
My Goals
Savings
Transactions
Yield Pool
Analytics

Settings and Help & Support were intentionally removed from the primary sidebar to keep the application focused on core savings and blockchain functionality.

🏗️ Technical Architecture

                    ┌─────────────────────┐
                    │       React UI      │
                    │ Dashboard / Goals   │
                    │ Savings / Analytics │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Ethers.js Layer    │
                    │ Wallet + RPC Calls  │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │       Astra Smart Contracts    │
              │ Savings / Goals / Yield Pool   │
              └───────────────┬────────────────┘
                              │
                              ▼
                     Ethereum Sepolia

🧰 Technology Stack

Frontend

React

Vite

JavaScript / JSX

CSS

Lucide React

Blockchain

Solidity

Ethers.js

MetaMask

Ethereum Sepolia Testnet

Development

Node.js

npm

Git

GitHub

📁 Project Structure

astra-frontend-ui/
│
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── blockchain/
│       └── connection.js
│
├── public/
├── package.json
├── vite.config.js
└── README.md

🔗 On-Chain Transaction Model

User Action
    │
    ▼
MetaMask Confirmation
    │
    ▼
Smart Contract
    │
    ▼
On-chain Event
    │
    ▼
Astra Transaction History
    │
    ├── Dashboard Recent Transactions
    ├── Transactions Page
    └── Analytics

The frontend reads blockchain events and converts them into user-friendly transaction records.

⚡ Transaction History

Astra uses chunked blockchain log queries because Sepolia RPC providers impose a maximum eth_getLogs block-range limit.

The current implementation scans history in safe chunks rather than requesting the entire chain in one RPC call.

Current limitation

Transaction history is functional but can take longer to load because the current implementation scans a relatively broad recent block range.

This is considered a future performance optimization, not a core functionality blocker.

🔐 Security Model

Astra does not custody users' private keys.

Wallet authentication is handled through MetaMask.

Transaction signing happens in the user's wallet.

Smart contracts enforce on-chain operations.

Transaction records are publicly verifiable on the blockchain.

The current application runs on Sepolia Testnet.

Important: Astra is currently an academic/testnet prototype and should not be treated as a production financial service.

🔬 Research & Novelty — Current Direction

The current Astra implementation establishes the foundation for an advanced protocol mechanism.

The next development phase is not yet implemented and will be based on a prior-art investigation.

Goal-Solvency-Preserving Yield Allocation

The working research direction is to investigate whether capital can be dynamically allocated toward yield while preserving the funding requirements of time-bound savings goals.

Conceptually:

                 User Funds
                     │
                     ▼
             Goal Solvency Engine
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Required Reserve        Excess Capital
          │                     │
          │                     ▼
          │               Yield Allocation
          │                     │
          ▼                     ▼
     Goal Reserve          Yield Strategy
          │                     │
          └──────────┬──────────┘
                     ▼
              Smart Contract

The research question under investigation is:

Can an on-chain constraint-driven capital allocation mechanism dynamically maximize yield exposure while preserving the solvency requirements of multiple time-bound savings goals?

Potential constraints include:

Goal target

Current goal funding

Time remaining

Required future contribution

Liquidity reserve

Maximum permitted yield exposure

Risk threshold

This mechanism is research/planning work at the current stage. Astra does not currently claim to implement this novelty.

🧪 Planned Evaluation

The proposed mechanism will eventually be evaluated against simpler allocation strategies.

Potential metrics:

Goal completion rate

Time to goal

Yield generated

Liquidity preserved

Capital efficiency

Goal safety margin

Reallocation frequency

Risk exposure

A potential comparison is:

Fixed Allocation
       VS
Goal-Solvency-Constrained Allocation

The goal is to demonstrate measurable improvement rather than claim novelty based only on implementation.

📌 Current Development Status

Component

Status

React frontend

✅ Implemented

MetaMask connection

✅ Implemented

Sepolia integration

✅ Implemented

Savings

✅ Implemented

Multiple goals

✅ Implemented

Goal funding

✅ Implemented

Goal withdrawal

✅ Implemented

Yield Pool

✅ Implemented

Transaction history

✅ Implemented

Transaction pagination

✅ Implemented

Analytics

✅ Implemented

Settings

Implemented but removed from sidebar

Help & Support

Removed from sidebar

Transaction loading optimization

⏸️ Future optimization

Novel allocation mechanism

🔬 Research phase

Novel smart-contract mechanism

🔬 Not implemented yet

Experimental evaluation

⏳ Planned

Patent assessment

⏳ After prior-art analysis

🛣️ Roadmap

Phase 1 — Core Platform

Wallet integration

Savings vault

Goal management

Yield pool

Transaction history

Analytics

Responsive UI

Phase 2 — Research

Prior-art investigation

Patent landscape analysis

Identify exact technical gap

Formalize allocation algorithm

Define mathematical constraints

Design smart-contract architecture

Phase 3 — Advanced Protocol

Implement allocation engine

Implement on-chain constraints

Add goal-solvency mechanism

Add dynamic yield exposure

Deploy to testnet

Integrate frontend

Phase 4 — Evaluation

Build simulation environment

Compare against fixed allocation

Measure goal completion

Measure yield

Measure liquidity protection

Document results

Phase 5 — Research Output

Technical documentation

Experimental results

Research paper preparation

Patent prior-art review

Patent drafting assessment

⚠️ Disclaimer

Astra is an academic/project prototype running on Ethereum Sepolia Testnet using test tokens.

It is not intended for real-money financial activity, investment advice, or production use.

👩‍💻 Project

Astra — Decentralized Savings Platform

Built as a blockchain project exploring transparent, programmable, goal-oriented savings and future adaptive capital allocation mechanisms.
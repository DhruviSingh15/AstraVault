# ASTRA Frontend

A dark futuristic fintech dashboard matching the supplied ASTRA UI reference.

## Run

1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run:

   npm install
   npm run dev

4. Open the local Vite URL shown in the terminal.

## Current state

The UI is a polished frontend prototype. Buttons and modals work locally, but the blockchain actions are demo interactions.

Next integration:
- ethers.js contract instances
- MetaMask wallet connection
- MockUSDC balance
- AstraGoalVault createGoal/fundGoal/goalProgress/calculateGoalYield/withdrawGoal
- AstraVaultFinal deposit/withdraw/calculateYield

Keep Solidity contracts in Remix as the source of truth.

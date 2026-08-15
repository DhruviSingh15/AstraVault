import { ethers } from "ethers";
import { CONTRACTS, SEPOLIA_CHAIN_ID } from "../contracts/addresses";
import MockUSDCABI from "../contracts/MockUSDC.json";
import AstraGoalVaultABI from "../contracts/AstraGoalVault.json";
import AstraVaultFinalABI from "../contracts/AstraVaultFinal.json";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  const network = await provider.getNetwork();

  if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
    throw new Error("Please switch MetaMask to Sepolia.");
  }

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return {
    provider,
    signer,
    address,
  };
}

export async function getContracts() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const usdc = new ethers.Contract(
    CONTRACTS.MOCK_USDC,
    MockUSDCABI,
    signer
  );

  const vault = new ethers.Contract(
    CONTRACTS.ASTRA_VAULT,
    AstraVaultFinalABI,
    signer
  );

  const goalVault = new ethers.Contract(
    CONTRACTS.ASTRA_GOAL_VAULT,
    AstraGoalVaultABI,
    signer
  );

  return {
    provider,
    signer,
    usdc,
    vault,
    goalVault,
  };
}

export async function getUSDCBalance(address) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  const usdc = new ethers.Contract(
    CONTRACTS.MOCK_USDC,
    MockUSDCABI,
    provider
  );

  const balance = await usdc.balanceOf(address);

  return ethers.formatUnits(balance, 6);
}

export async function depositToSavings(amount) {
  const { usdc, vault } = await getContracts();

  // Convert 50 tUSDC → 50000000 base units
  const amountInUnits = ethers.parseUnits(amount.toString(), 6);

  // 1. Approve AstraVaultFinal to spend the tUSDC
  const approvalTx = await usdc.approve(
    CONTRACTS.ASTRA_VAULT,
    amountInUnits
  );

  await approvalTx.wait();

  // 2. Deposit the approved tUSDC into the vault
  const depositTx = await vault.deposit(amountInUnits);

  const receipt = await depositTx.wait();

  return receipt;
}

export async function getVaultData(address) {
  const { vault } = await getContracts();

  const principal = await vault.deposits(address);
  const yieldEarned = await vault.calculateYield(address);
  const total = await vault.balanceOf(address);

  return {
    principal: ethers.formatUnits(principal, 6),
    yield: ethers.formatUnits(yieldEarned, 6),
    total: ethers.formatUnits(total, 6),
  };
}

export async function createGoalOnChain(
  name,
  targetAmount,
  deadline
) {
  const { goalVault } = await getContracts();

  // Astra uses 6 decimal places, just like MockUSDC
  const targetInUnits = ethers.parseUnits(
    targetAmount.toString(),
    6
  );

  // Convert JavaScript timestamp from milliseconds to seconds
  const deadlineTimestamp = Math.floor(
    new Date(deadline).getTime() / 1000
  );

  const tx = await goalVault.createGoal(
    name,
    targetInUnits,
    deadlineTimestamp
  );

  const receipt = await tx.wait();

  return receipt;
}

export async function getGoalData(address) {
  const { goalVault } = await getContracts();

  const count = Number(await goalVault.goalCount());

  if (count === 0) {
    return [];
  }

  const goals = [];

  for (let goalId = 0; goalId < count; goalId++) {
    try {
      const goal = await goalVault.userGoals(
        address,
        goalId
      );

      const progress = await goalVault.goalProgress(
        goalId
      );

      const yieldEarned =
        await goalVault.calculateGoalYield(
          address,
          goalId
        );

      goals.push({
        id: goalId,
        name: goal.name,
        target: ethers.formatUnits(
          goal.targetAmount,
          6
        ),
        saved: ethers.formatUnits(
          goal.savedAmount,
          6
        ),
        depositTime: Number(
          goal.depositTime
        ),
        deadline: Number(
          goal.deadline
        ),
        completed: goal.completed,
        active: goal.active,
        yield: ethers.formatUnits(
          yieldEarned,
          6
        ),
        progress: Number(
          progress.percentage
        ),
      });
    } catch (error) {
      console.error(
        `Failed to load goal ${goalId}:`,
        error
      );
    }
  }

  return goals;
}

export async function fundGoalOnChain(goalId, amount) {
  const { usdc, goalVault } = await getContracts();

  const amountInUnits = ethers.parseUnits(
    amount.toString(),
    6
  );

  // Step 1: Allow AstraGoalVault to spend the tokens
  const approvalTx = await usdc.approve(
    CONTRACTS.ASTRA_GOAL_VAULT,
    amountInUnits
  );

  await approvalTx.wait();

  // Step 2: Fund the selected goal
  const fundTx = await goalVault.fundGoal(
    goalId,
    amountInUnits
  );

  const receipt = await fundTx.wait();

  return receipt;
}

export async function getRecentTransactions(address) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  const vault = new ethers.Contract(
    CONTRACTS.ASTRA_VAULT,
    AstraVaultFinalABI,
    provider
  );

  const goalVault = new ethers.Contract(
    CONTRACTS.ASTRA_GOAL_VAULT,
    AstraGoalVaultABI,
    provider
  );

  const currentBlock = await provider.getBlockNumber();

  // Search recent Sepolia history
  const fromBlock = Math.max(0, currentBlock - 10000);

  const transactions = [];

  // ------------------------------------------------
  // ASTRA VAULT EVENTS
  // ------------------------------------------------

  const depositedEvents = await vault.queryFilter(
    vault.filters.Deposited(address),
    fromBlock,
    currentBlock
  );

  for (const event of depositedEvents) {
    const block = await provider.getBlock(
      event.blockNumber
    );

    transactions.push({
      title: "Deposit to Savings",
      detail: `+${Number(
        ethers.formatUnits(event.args.amount, 6)
      ).toFixed(2)} tUSDC`,
      tone: "blue",
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      meta: block
        ? new Date(
            Number(block.timestamp) * 1000
          ).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
    });
  }

  const withdrawnEvents = await vault.queryFilter(
    vault.filters.Withdrawn(address),
    fromBlock,
    currentBlock
  );

  for (const event of withdrawnEvents) {
    const principal = Number(
      ethers.formatUnits(event.args.principal, 6)
    );

    const yieldAmount = Number(
      ethers.formatUnits(event.args.yield, 6)
    );

    const block = await provider.getBlock(
      event.blockNumber
    );

    transactions.push({
      title: "Withdraw Savings",
      detail: `+${(
        principal + yieldAmount
      ).toFixed(2)} tUSDC`,
      tone: "green",
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      meta: block
        ? new Date(
            Number(block.timestamp) * 1000
          ).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
    });
  }

  // ------------------------------------------------
  // GOAL VAULT EVENTS
  // ------------------------------------------------

  const goalCreatedEvents = await goalVault.queryFilter(
    goalVault.filters.GoalCreated(address),
    fromBlock,
    currentBlock
  );

  for (const event of goalCreatedEvents) {
    const block = await provider.getBlock(
      event.blockNumber
    );

    transactions.push({
      title: "Create Goal",
      detail: event.args.name,
      tone: "purple",
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      meta: block
        ? new Date(
            Number(block.timestamp) * 1000
          ).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
    });
  }

  const goalFundedEvents = await goalVault.queryFilter(
    goalVault.filters.GoalFunded(address),
    fromBlock,
    currentBlock
  );

  for (const event of goalFundedEvents) {
    const block = await provider.getBlock(
      event.blockNumber
    );

    transactions.push({
      title: "Add Savings to Goal",
      detail: `+${Number(
        ethers.formatUnits(event.args.amount, 6)
      ).toFixed(2)} tUSDC`,
      tone: "green",
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      meta: block
        ? new Date(
            Number(block.timestamp) * 1000
          ).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
    });
  }

  const goalWithdrawnEvents = await goalVault.queryFilter(
    goalVault.filters.GoalWithdrawn(address),
    fromBlock,
    currentBlock
  );

  for (const event of goalWithdrawnEvents) {
    const principal = Number(
      ethers.formatUnits(event.args.principal, 6)
    );

    const yieldAmount = Number(
      ethers.formatUnits(event.args.yield, 6)
    );

    const block = await provider.getBlock(
      event.blockNumber
    );

    transactions.push({
      title: "Withdraw Goal",
      detail: `+${(
        principal + yieldAmount
      ).toFixed(2)} tUSDC`,
      tone: "orange",
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      meta: block
        ? new Date(
            Number(block.timestamp) * 1000
          ).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
    });
  }

  // ------------------------------------------------
  // YIELD POOL EVENTS
  // ------------------------------------------------

  const yieldFundedEvents = await goalVault.queryFilter(
    goalVault.filters.YieldFunded(),
    fromBlock,
    currentBlock
  );

  for (const event of yieldFundedEvents) {
    const block = await provider.getBlock(
      event.blockNumber
    );

    transactions.push({
      title: "Fund Yield Pool",
      detail: `+${Number(
        ethers.formatUnits(event.args.amount, 6)
      ).toFixed(2)} tUSDC`,
      tone: "purple",
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      meta: block
        ? new Date(
            Number(block.timestamp) * 1000
          ).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown date",
    });
  }

  // ------------------------------------------------
  // SORT NEWEST → OLDEST
  // ------------------------------------------------

  return transactions.sort(
    (a, b) =>
      b.blockNumber - a.blockNumber
  );
}

export async function withdrawGoalOnChain(goalId) {
  const { goalVault } = await getContracts();

  const tx = await goalVault.withdrawGoal(goalId);

  const receipt = await tx.wait();

  return receipt;
}

export async function fundYieldOnChain(amount) {
  const { usdc, goalVault } = await getContracts();

  const amountInUnits = ethers.parseUnits(
    amount.toString(),
    6
  );

  // 1. Approve AstraGoalVault to spend tUSDC
  const approvalTx = await usdc.approve(
    CONTRACTS.ASTRA_GOAL_VAULT,
    amountInUnits
  );

  await approvalTx.wait();

  // 2. Fund the yield pool
  const fundTx = await goalVault.fundYield(
    amountInUnits
  );

  const receipt = await fundTx.wait();

  return receipt;
}

export async function getYieldPool() {
  const { goalVault } = await getContracts();

  const pool = await goalVault.yieldPool();

  return ethers.formatUnits(pool, 6);
}
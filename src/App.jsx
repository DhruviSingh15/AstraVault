import React, { useEffect,useMemo, useState } from "react";
import {
  connectWallet as connectBlockchainWallet,
  getUSDCBalance,
  depositToSavings,
  getVaultData,
  createGoalOnChain,
  getGoalData,
  fundGoalOnChain,
  getRecentTransactions,
  withdrawGoalOnChain,
} from "./blockchain/connection";

import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Coins,
  Copy,
  Crosshair,
  Download,
  Home,
  Landmark,
  LockKeyhole,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";

function IconBadge({ children, tone = "purple" }) {
  return <span className={`icon-badge ${tone}`}>{children}</span>;
}

function StatCard({ icon: Icon, title, value, subtitle, tone }) {
  return (
    <div className={`stat-card ${tone}`}>
      <IconBadge tone={tone}><Icon size={31} strokeWidth={2.2} /></IconBadge>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-kicker">ASTRA</div>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={19}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function App() {
  const handleConnectWallet = async () => {
    try {
      const { address } = await connectBlockchainWallet();

      setWalletAddress(address);
      setWalletConnected(true);

      const balance = await getUSDCBalance(address);
      setUsdcBalance(balance);

      const data = await getVaultData(address);
      setVaultData(data);

      const goal = await getGoalData(address);
      setGoalData(goal);

      const txs = await getRecentTransactions(address);
      setRecentTransactions(txs);

      notify(
        `Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`
      );

      console.log("Connected wallet:", address);
    } catch (error) {
      console.error("Wallet connection failed:", error);

      notify(error.message || "Wallet connection failed");
    }
  };

  const [active, setActive] = useState("Dashboard");
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [showCreate, setShowCreate] = useState(false);
  const [showAction, setShowAction] = useState(null);
  const [goalName, setGoalName] = useState("Emergency Fund");
  const [target, setTarget] = useState("500");
  const [deadline, setDeadline] = useState("2026-09-15");
  const [toast, setToast] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("50");
  const [goalFundingAmount, setGoalFundingAmount] = useState("25");
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [creatingGoal, setCreatingGoal] = useState(false);

  const [vaultData, setVaultData] = useState({
    principal: "0.00",
    yield: "0.00",
    total: "0.00",
  });

  const [goalData, setGoalData] = useState(null);

   const [recentTransactions, setRecentTransactions] = useState([]);

  const nav = useMemo(() => [
    ["Dashboard", Home],
    ["My Goals", Target],
    ["Savings", Wallet],
    ["Transactions", SlidersHorizontal],
    ["Yield Pool", Coins],
    ["Analytics", BarChart3],
    ["Settings", Settings],
    ["Help & Support", CircleHelp],
  ], []);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__astraToast);
    window.__astraToast = window.setTimeout(() => setToast(""), 2400);
  };

  const refresh = async () => {
    if (!walletConnected || !walletAddress) {
      notify("Connect your wallet first");
      return;
    }

    try {
      setRefreshing(true);

      const balance = await getUSDCBalance(walletAddress);
      setUsdcBalance(balance);

      const vault = await getVaultData(walletAddress);
      setVaultData(vault);

      const goal = await getGoalData(walletAddress);
      setGoalData(goal);

      const txs = await getRecentTransactions(walletAddress);
      setRecentTransactions(txs);

      notify("Dashboard refreshed from blockchain");
    } catch (error) {
      console.error("Refresh failed:", error);

      notify(
        error?.reason ||
        error?.shortMessage ||
        "Failed to refresh blockchain data"
      );
    } finally {
      setRefreshing(false);
    }
  };

  const createGoal = async (e) => {
    e.preventDefault();

    if (!walletConnected) {
      notify("Connect your wallet first");
      return;
    }

    if (!goalName.trim()) {
      notify("Enter a goal name");
      return;
    }

    if (!target || Number(target) <= 0) {
      notify("Enter a valid target amount");
      return;
    }

    if (!deadline) {
      notify("Select a deadline");
      return;
    }

    try {
      setCreatingGoal(true);

      notify("Confirm the goal transaction in MetaMask...");

      await createGoalOnChain(
        goalName,
        target,
        deadline
      );

      setShowCreate(false);

      notify(`Goal "${goalName}" created successfully!`);

    } catch (error) {
      console.error("Goal creation failed:", error);

      notify(
        error?.reason ||
        error?.shortMessage ||
        "Goal creation failed"
      );
    } finally {
      setCreatingGoal(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span>A</span>
          </div>
          <div>
            <div className="brand-name">ASTRA</div>
            <div className="brand-sub">Decentralized Savings</div>
          </div>
        </div>

        <nav className="side-nav">
          {nav.map(([label, Icon]) => (
            <button
              key={label}
              className={`nav-item ${active === label ? "active" : ""}`}
              onClick={() => setActive(label)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="wallet-card">
            <div className="wallet-line">
              <span className={walletConnected ? "green-dot" : "red-dot"} />
              <span>
                {walletConnected ? "Wallet Connected" : "Wallet Not Connected"}
              </span>
            </div>

            <div className="wallet-address">
              {walletConnected
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : "Connect your wallet"}
            </div>

            {!walletConnected && (
              <button
                className="connect-btn"
                onClick={handleConnectWallet}
              >
                <Wallet size={16} />
                Connect Wallet
              </button>
            )}

            <div className="network-chip">
              <span className="network-dot" />
              <span>Sepolia</span>
              <span className="network-live" />
            </div>
          </div>

          <div className="future-card">
            <div className="future-title">Grow your future</div>
            <div className="future-copy">with decentralized savings</div>
            <div className="vault-art">
              <div className="vault-glow" />
              <div className="vault-box">
                <div className="vault-door">
                  <div className="vault-wheel" />
                </div>
              </div>
              <span className="coin c1">$</span>
              <span className="coin c2">◆</span>
              <span className="coin c3">$</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="welcome">
            <div className="welcome-label">Welcome back,</div>
            <div className="address-row">
              <strong>
                {walletConnected
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : "Not Connected"}
              </strong>
              {walletConnected && (
                <Copy size={17} className="copy-icon" />
              )}
            </div>
            <div className="connected">
              <span className={walletConnected ? "green-dot" : "red-dot"} />
              {walletConnected ? "Connected" : "Not Connected"}
            </div>

          </div>

          <div className="balance-card">
            <IconBadge tone="blue"><Coins size={31}/></IconBadge>
            <div>
              <div className="balance-label">USDC Balance</div>
              <div className="balance-value">
                {Number(usdcBalance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span>tUSDC</span>
              </div>
              <div className="balance-sub">Test Token</div>
            </div>
            <button className="refresh-btn" onClick={refresh}>
              <RefreshCw size={17} className={refreshing ? "spin" : ""}/>
              Refresh
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <StatCard
            icon={Wallet}
            title="Total Savings"
            value={`${Number(vaultData.total).toFixed(2)} tUSDC`}
            subtitle="Principal + Yield"
            tone="purple"
          />

          <StatCard
            icon={Coins}
            title="Total Principal"
            value={`${Number(vaultData.principal).toFixed(2)} tUSDC`}
            subtitle="Total Deposited"
            tone="blue"
          />

          <StatCard
            icon={TrendingUp}
            title="Total Yield Earned"
            value={`${Number(vaultData.yield).toFixed(2)} tUSDC`}
            subtitle="+5.0% APY"
            tone="green"
          />

          <StatCard
            icon={Crosshair}
            title="Active Goals"
            value={goalData && Number(goalData.saved) > 0 ? "1" : "0"}
            subtitle="In Progress"
            tone="orange"
          />
        </section>

        <div className="content-grid">
          <section className="goals-section">
            <div className="section-heading">
              <h1>My Goals</h1>
              <button className="primary-btn" onClick={() => setShowCreate(true)}>
                <Plus size={18}/> Create New Goal
              </button>
            </div>

            <div className="goal-card">
              <div className="goal-top">
                <div className="goal-icon"><LockKeyhole size={29}/></div>
                <div className="goal-title-wrap">
                  <div className="goal-name-line">
                    <h2>{goalData ? goalData.name : "No Goal Yet"}</h2>
                    <span className="status-pill">{goalData?.completed ? "Completed" : Number(goalData?.saved || 0) > 0 ? "Active" : "Withdrawn"}</span>
                  </div>
                  <div className="goal-target">Target: {goalData ? Number(goalData.target).toFixed(2) : "0.00"} tUSDC</div>
                </div>
                <button className="dots-btn" onClick={() => notify("Goal options opened")}>•••</button>
              </div>

              <div className="progress-row">
                <div>
                  <strong>
                    {goalData ? Number(goalData.saved).toFixed(2) : "0.00"}
                  </strong>{" "}
                  /{" "}
                  {goalData ? Number(goalData.target).toFixed(2) : "0.00"}{" "}
                  <span>tUSDC</span>
                </div>

                <strong>
                  {goalData ? goalData.progress : 0}%
                </strong>
              </div>
              <div className="progress-track"><div className="progress-fill" style={{width: `${goalData ? goalData.progress : 0}%`}} /></div>

              <div className="goal-metrics">
                <div><span>Saved Amount</span><strong className="cyan-text">{goalData ? Number(goalData.saved).toFixed(2) : "0.00"} tUSDC</strong></div>
                <div><span>Yield Earned</span><strong className="green-text">{goalData ? Number(goalData.yield).toFixed(6) : "0.000000"} tUSDC</strong></div>
                <div><span>Monthly Yield</span><strong className="orange-text">{goalData ? (Number(goalData.target) * 0.05 / 12).toFixed(6) : "0.000000"}{" "} tUSDC</strong></div>
                <div><span>Deadline</span>
                  <strong className="pink-text">
                    {goalData
                      ? new Date(goalData.deadline * 1000).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </strong>
                </div>
              </div>

              <div className="goal-actions">
                <button className="action-blue" onClick={() => setShowAction("add")}>
                  <Plus size={19}/> Add Savings
                </button>
                <button className="action-purple" onClick={() => setShowAction("withdraw")}>
                  <ArrowUpRight size={19}/> Withdraw Goal
                </button>
              </div>
            </div>

            <div className="goal-summary">
              <div>
                <ClipboardList size={27}/>
                <div><span>Total Goals</span><strong>{goalData ? 1 : 0}</strong></div>
              </div>
              <div>
                <Check size={28}/>
                <div><span>Completed Goals</span><strong>{goalData?.completed ? 1 : 0}</strong></div>
              </div>
              <div>
                <div className="ring"><span>{goalData ? goalData.progress : 0}%</span></div>
                <div><span>Completion Rate</span><strong>{goalData ? goalData.progress : 0}%</strong></div>
              </div>
            </div>
          </section>

          <aside className="right-column">
            <div className="panel quick-panel">
              <h3>Quick Actions</h3>
              <button onClick={() => setShowAction("deposit")}><IconBadge tone="blue"><Download size={18}/></IconBadge>Deposit to Savings</button>
              <button onClick={() => setShowCreate(true)}><IconBadge tone="purple"><Target size={18}/></IconBadge>Create New Goal</button>
              <button onClick={() => setShowAction("add")}><IconBadge tone="green"><Plus size={18}/></IconBadge>Add Savings to Goal</button>
              <button onClick={() => setShowAction("withdraw")}><IconBadge tone="orange"><ArrowUpRight size={18}/></IconBadge>Withdraw Savings</button>
              <button onClick={() => setShowAction("yield")}><IconBadge tone="purple"><Coins size={18}/></IconBadge>Fund Yield Pool</button>
            </div>

            <div className="panel transactions">
              <div className="panel-title-row">
                <h3>Recent Transactions</h3>
                <button onClick={() => setActive("Transactions")}>View All</button>
              </div>
              {recentTransactions.length === 0 ? (
                <div className="empty-transactions">
                  No recent transactions
                </div>
              ) : (
                recentTransactions.map((tx, i) => (
                  <div className="tx-row" key={`${tx.transactionHash}-${i}`}>
                    <IconBadge tone={tx.tone}>
                      {tx.title.includes("Withdraw") ? (
                        <ArrowUpRight size={17} />
                      ) : tx.title.includes("Deposit") ? (
                        <ArrowDownToLine size={17} />
                      ) : tx.title.includes("Goal") ? (
                        <Target size={17} />
                      ) : (
                        <Coins size={17} />
                      )}
                    </IconBadge>

                    <div className="tx-info">
                      <div className="tx-title">
                        {tx.title}
                      </div>

                      <div className="tx-meta">
                        {tx.meta}
                      </div>
                    </div>

                    <div className={`tx-value ${tx.tone}`}>
                      {tx.detail}
                      <span>Success</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        <footer>
          <ShieldCheck size={18}/> Astra Protocol ©2026. All rights reserved.
        </footer>
      </main>b 

      {showCreate && (
        <Modal title="Create New Goal" onClose={() => setShowCreate(false)}>
          <form className="modal-form" onSubmit={createGoal}>
            <label>Goal name<input value={goalName} onChange={(e) => setGoalName(e.target.value)} /></label>
            <label>Target amount (tUSDC)<input value={target} onChange={(e) => setTarget(e.target.value)} inputMode="decimal"/></label>
            <label>
              Deadline
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={creatingGoal}
              />
            </label>
            <button
              className="primary-btn wide"
              type="submit"
              disabled={creatingGoal}
            >
              <Plus size={18}/>

              {creatingGoal
                ? "Creating Goal..."
                : "Create Goal"}
            </button>
          </form>
        </Modal>
      )}

      {showAction && (
        <Modal
          title={
            showAction === "add" ? "Add Savings to Goal" :
            showAction === "withdraw" ? "Withdraw Goal" :
            showAction === "yield" ? "Fund Yield Pool" :
            "Deposit to Savings"
          }
          onClose={() => {
            if (!transactionLoading) {
              setShowAction(null);
            }
          }}
        >
          <div className="action-modal">
            <div className="action-big-icon">
              <Zap size={32} />
            </div>

            {showAction === "deposit" ? (
              <>
                <h3>Deposit to Savings</h3>

                <p>
                  Deposit your tUSDC into the Astra savings vault.
                </p>

                <label>
                  Amount (tUSDC)

                  <input
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    inputMode="decimal"
                    min="0"
                    placeholder="50"
                    disabled={transactionLoading}
                  />
                </label>

                <button
                  className="primary-btn wide"
                  disabled={transactionLoading}
                  onClick={async () => {
                    try {
                      if (!walletConnected) {
                        notify("Connect your wallet first");
                        return;
                      }

                      if (!depositAmount || Number(depositAmount) <= 0) {
                        notify("Enter a valid amount");
                        return;
                      }

                      setTransactionLoading(true);

                      notify("Waiting for token approval...");

                      await depositToSavings(depositAmount);

                      const balance = await getUSDCBalance(walletAddress);
                      setUsdcBalance(balance);

                      setShowAction(null);

                      notify("Deposit successful!");
                    } catch (error) {
                      console.error("Deposit failed:", error);

                      notify(
                        error?.reason ||
                        error?.shortMessage ||
                        "Deposit failed"
                      );
                    } finally {
                      setTransactionLoading(false);
                    }
                  }}
                >
                  {transactionLoading
                    ? "Processing..."
                    : "Deposit to Savings"}
                </button>
              </>
            ) : showAction === "add" ? (
              <>
                <h3>Add Savings to Goal</h3>

                <p>
                  Add tUSDC directly to your selected savings goal.
                </p>

                <label>
                  Amount (tUSDC)

                  <input
                    value={goalFundingAmount}
                    onChange={(e) =>
                      setGoalFundingAmount(e.target.value)
                    }
                    inputMode="decimal"
                    min="0"
                    placeholder="25"
                    disabled={transactionLoading}
                  />
                </label>

                <button
                  className="primary-btn wide"
                  disabled={transactionLoading}
                  onClick={async () => {
                    try {
                      if (!walletConnected) {
                        notify("Connect your wallet first");
                        return;
                      }

                      if (!goalData) {
                        notify("No goal found");
                        return;
                      }

                      if (
                        !goalFundingAmount ||
                        Number(goalFundingAmount) <= 0
                      ) {
                        notify("Enter a valid amount");
                        return;
                      }

                      setTransactionLoading(true);

                      notify("Waiting for token approval...");

                      await fundGoalOnChain(
                        goalData.id,
                        goalFundingAmount
                      );

                      // Refresh wallet balance
                      const balance = await getUSDCBalance(
                        walletAddress
                      );

                      setUsdcBalance(balance);

                      // Refresh goal data
                      const updatedGoal = await getGoalData(
                        walletAddress
                      );

                      setGoalData(updatedGoal);

                      setShowAction(null);

                      notify("Goal funded successfully!");

                    } catch (error) {
                      console.error(
                        "Goal funding failed:",
                        error
                      );

                      notify(
                        error?.reason ||
                        error?.shortMessage ||
                        "Goal funding failed"
                      );
                    } finally {
                      setTransactionLoading(false);
                    }
                  }}
                >
                  {transactionLoading
                    ? "Processing..."
                    : "Fund Goal"}
                </button>
              </>
            ) : showAction === "withdraw" ? (
              <>
                <h3>Withdraw Goal</h3>

                <p>
                  Withdraw your saved amount and earned yield
                  from this goal.
                </p>

                <button
                  className="primary-btn wide"
                  disabled={transactionLoading}
                  onClick={async () => {
                    try {
                      if (!walletConnected) {
                        notify("Connect your wallet first");
                        return;
                      }

                      if (!goalData) {
                        notify("No goal found");
                        return;
                      }

                      setTransactionLoading(true);

                      notify(
                        "Confirm the withdrawal transaction in MetaMask..."
                      );

                      await withdrawGoalOnChain(
                        goalData.id
                      );

                      // Refresh wallet balance
                      const balance = await getUSDCBalance(
                        walletAddress
                      );

                      setUsdcBalance(balance);

                      // Refresh goal
                      const updatedGoal =
                        await getGoalData(walletAddress);

                      setGoalData(updatedGoal);

                      // Refresh transactions
                      const txs =
                        await getRecentTransactions(
                          walletAddress
                        );

                      setRecentTransactions(txs);

                      setShowAction(null);

                      notify(
                        "Goal withdrawn successfully!"
                      );

                    } catch (error) {
                      console.error(
                        "Goal withdrawal failed:",
                        error
                      );

                      notify(
                        error?.reason ||
                        error?.shortMessage ||
                        "Goal withdrawal failed"
                      );
                    } finally {
                      setTransactionLoading(false);
                    }
                  }}
                >
                  {transactionLoading
                    ? "Processing..."
                    : "Confirm Withdrawal"}
                </button>
              </>
            ) : (
              <>
                <h3>Blockchain transaction</h3>

                <p>
                  This action will be connected to your Astra
                  Solidity contracts next.
                </p>

                <button
                  className="primary-btn wide"
                  onClick={() => {
                    setShowAction(null);
                    notify("Demo transaction submitted");
                  }}
                >
                  Continue
                </button>
              </>
            )}
          </div>
        </Modal>
      )}

      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
    </div>
  );
}

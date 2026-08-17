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
  fundYieldOnChain,
  getYieldPool,
} from "./blockchain/connection";

import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  ChevronLeft,
  CircleHelp,
  ClipboardList,
  Coins,
  Copy,
  Crosshair,
  Download,
  Globe2,
  Home,
  List,
  Landmark,
  LockKeyhole,
  LogOut,
  Moon,
  Plus,
  Info,
  RefreshCw,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShieldAlert,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Trash2,
  Wallet,
  WalletCards,
  X,
  Zap,
  Percent,
  Palette,
  Lock,
  ExternalLink,
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

function YieldPoolPage({
  yieldPool,
  walletConnected,
  usdcBalance,
  setShowAction,
}) {
  return (
    <section className="yield-page">

      {/* Header */}
      <div className="yield-header">
        <div>
          <h1>Yield Pool</h1>
          <p>
            Liquidity pool that powers instant goal
            withdrawals and protocol stability.
          </p>
        </div>

        <button className="how-it-works-btn">
          <CircleHelp size={17} />
          How it works
        </button>
      </div>

      {/* Top section */}
      <div className="yield-hero-grid">

        {/* Pool balance card */}
        <div className="yield-pool-card">

          <div className="yield-card-title">
            <span>Total Yield Pool</span>
            <CircleHelp size={16} />
          </div>

          <div className="yield-pool-value">
            {Number(yieldPool || 0).toFixed(2)}
          </div>

          <div className="yield-token">
            tUSDC
          </div>

          <div className="yield-card-bottom">
            <span>
              Liquidity available for goal withdrawals
            </span>

            <div className="yield-coin">
              <Coins size={28} />
            </div>
          </div>

        </div>

        {/* Visual */}
        <div className="yield-visual">

          <div className="yield-glow" />

          <div className="yield-platform">
            <div className="yield-platform-ring">
              <div className="yield-water" />
            </div>
          </div>

          <div className="yield-coin-float coin-one">
            $
          </div>

          <div className="yield-coin-float coin-two">
            $
          </div>

          <div className="yield-coin-float coin-three">
            $
          </div>

          <div className="yield-block block-one" />
          <div className="yield-block block-two" />
          <div className="yield-block block-three" />

        </div>

      </div>

      {/* Bottom cards */}
      <div className="yield-bottom-grid">

        {/* About */}
        <div className="panel yield-about">

          <h2>About Yield Pool</h2>

          <div className="yield-info-row">
            <div className="yield-info-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3>Provides Liquidity</h3>
              <p>
                Funds in the pool are used to enable
                instant goal withdrawals.
              </p>
            </div>
          </div>

          <div className="yield-info-row">
            <div className="yield-info-icon">
              <Percent size={21} />
            </div>

            <div>
              <h3>Earns Yield</h3>
              <p>
                The pool supports the Astra savings
                ecosystem and liquidity.
              </p>
            </div>
          </div>

          <div className="yield-info-row">
            <div className="yield-info-icon">
              <Lock size={21} />
            </div>

            <div>
              <h3>Secure & Transparent</h3>
              <p>
                All pool activity is recorded on-chain
                through smart contracts.
              </p>
            </div>
          </div>

        </div>

        {/* Fund pool */}
        <div className="panel yield-fund-card">

          <h2>Fund Yield Pool</h2>

          <p>
            Contribute tUSDC to support goal withdrawals
            and protocol liquidity.
          </p>

          <div className="yield-balance-row">
            <span>Your tUSDC balance</span>
            <strong>
              {Number(usdcBalance || 0).toFixed(2)} tUSDC
            </strong>
          </div>

          <button
            className="yield-fund-button"
            disabled={!walletConnected}
            onClick={() => setShowAction("yield")}
          >
            <ArrowUpRight size={20} />
            Fund Yield Pool
          </button>

          <div className="yield-security">
            <ShieldCheck size={17} />
            Funds are secured by Astra smart contracts.
          </div>

        </div>

      </div>

    </section>
  );
}

function TransactionsPage({
  transactions,
  usdcBalance,
  onRefresh,
  transactionLoading,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 8;

  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / transactionsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex =
    (safePage - 1) * transactionsPerPage;

  const visibleTransactions = transactions.slice(
    startIndex,
    startIndex + transactionsPerPage
  );

  const getTransactionIcon = (title) => {
    if (title.includes("Fund Yield Pool")) {
      return <Coins size={19} />;
    }

    if (title.includes("Withdraw Goal")) {
      return <ArrowUpRight size={19} />;
    }

    if (title.includes("Withdraw")) {
      return <ArrowUpRight size={19} />;
    }

    if (title.includes("Deposit")) {
      return <ArrowDownToLine size={19} />;
    }

    if (title.includes("Create Goal")) {
      return <Target size={19} />;
    }

    if (title.includes("Add Savings")) {
      return <Target size={19} />;
    }

    return <Coins size={19} />;
  };

  const getTransactionType = (title) => {
    if (title.includes("Fund Yield Pool")) {
      return "Yield";
    }

    if (title.includes("Withdraw")) {
      return "Withdraw";
    }

    if (title.includes("Deposit")) {
      return "Deposit";
    }

    if (title.includes("Goal")) {
      return "Goal";
    }

    return "Transaction";
  };

  return (
    <section className="transactions-page">

      {/* PAGE HEADER */}
      <div className="transactions-topbar">

        <div>
          <h1>Transactions</h1>
        </div>

        <div className="transactions-wallet-actions">

          <div className="transactions-balance-card">
            <div className="transactions-balance-icon">
              <Wallet size={25} />
            </div>

            <div>
              <span>USDC Balance</span>
              <strong>
                {Number(usdcBalance || 0).toFixed(2)} tUSDC
              </strong>
              <small>Test Token</small>
            </div>
          </div>

          <button
            className="transactions-refresh-btn"
            onClick={onRefresh}
            disabled={transactionLoading}
          >
            <RefreshCw
              size={17}
              className={
                transactionLoading
                  ? "refresh-spinning"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </div>


      {/* MAIN TRANSACTION PANEL */}
      <div className="transactions-main-panel">

        {/* HEADER */}
        <div className="transactions-panel-header">

          <div>
            <h2>All Transactions</h2>

            <p>
              Complete on-chain transaction history
              for your Astra wallet.
            </p>
          </div>

          <div className="transaction-count-badge">
            <ClipboardList size={17} />

            {transactions.length} Transactions
          </div>

        </div>


        {/* TABLE */}
        <div className="transactions-table">

          {/* TABLE HEADER */}
          <div className="transaction-table-header">

            <div>Type</div>
            <div>Description</div>
            <div>Amount</div>
            <div>Date & Time</div>
            <div>Status</div>
            <div>TX Hash</div>

          </div>


          {/* ROWS */}
          {visibleTransactions.length === 0 ? (

            <div className="transactions-empty">
              <Coins size={34} />

              <h3>No transactions yet</h3>

              <p>
                Your blockchain transactions will
                appear here.
              </p>
            </div>

          ) : (

            visibleTransactions.map((tx, index) => {

              const isPositive =
                tx.detail?.startsWith("+");

              const isNegative =
                tx.detail?.startsWith("-");

              return (
                <div
                  className="transaction-table-row"
                  key={
                    tx.transactionHash
                      ? `${tx.transactionHash}-${index}`
                      : `${tx.blockNumber}-${index}`
                  }
                >

                  {/* TYPE */}
                  <div className="transaction-type-cell">

                    <div
                      className={`transaction-icon ${tx.tone || "purple"}`}
                    >
                      {getTransactionIcon(tx.title)}
                    </div>

                    <span>
                      {getTransactionType(tx.title)}
                    </span>

                  </div>


                  {/* DESCRIPTION */}
                  <div className="transaction-description">

                    <strong>
                      {tx.title}
                    </strong>

                    <span>
                      {tx.title === "Fund Yield Pool"
                        ? "Added liquidity to yield pool"
                        : tx.detail}
                    </span>

                  </div>


                  {/* AMOUNT */}
                  <div
                    className={`transaction-amount ${
                      isNegative
                        ? "negative"
                        : isPositive
                        ? "positive"
                        : "neutral"
                    }`}
                  >
                    {tx.detail}
                  </div>


                  {/* DATE */}
                  <div className="transaction-date">
                    {tx.meta || "Unknown date"}
                  </div>


                  {/* STATUS */}
                  <div>
                    <span className="transaction-status">
                      Success
                    </span>
                  </div>


                  {/* HASH */}
                  <div className="transaction-hash">

                    {tx.transactionHash ? (
                      <>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {tx.transactionHash.slice(0, 6)}
                          ...
                          {tx.transactionHash.slice(-4)}
                        </a>

                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hash-external"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </>
                    ) : (
                      "—"
                    )}

                  </div>

                </div>
              );
            })

          )}

        </div>


        {/* PAGINATION */}
        {transactions.length > transactionsPerPage && (
          <div className="transactions-pagination">

            <button
              disabled={safePage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
            >
              <ChevronLeft size={16} />
              Previous
            </button>


            <div className="pagination-pages">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  className={
                    page === safePage
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>

              ))}

            </div>


            <button
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
            >
              Next
              <ChevronRight size={16} />
            </button>

          </div>
        )}

      </div>

    </section>
  );
}

function MyGoalsPage({
  goals,
  onCreateGoal,
  onAddSavings,
  onWithdraw,
}) {
  const totalGoals = goals.length;

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.target || 0),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.saved || 0),
    0
  );

  const averageProgress =
    totalGoals > 0
      ? goals.reduce(
          (sum, goal) => sum + Number(goal.progress || 0),
          0
        ) / totalGoals
      : 0;

  return (
    <section className="my-goals-page">

      {/* HEADER */}
      <div className="my-goals-header">

        <div>
          <h1>My Goals</h1>

          <p>
            Track and manage all your savings goals in one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={onCreateGoal}
        >
          <Plus size={18} />
          Create New Goal
        </button>

      </div>


      {/* SUMMARY CARDS */}
      <div className="my-goals-stats">

        <div className="my-goal-stat purple">
          <IconBadge tone="purple">
            <Target size={29} />
          </IconBadge>

          <div>
            <span>Total Goals</span>
            <strong>{totalGoals}</strong>
            <small>All created goals</small>
          </div>
        </div>


        <div className="my-goal-stat green">
          <IconBadge tone="green">
            <Wallet size={29} />
          </IconBadge>

          <div>
            <span>Total Target</span>
            <strong>
              {totalTarget.toFixed(2)} tUSDC
            </strong>
            <small>Across all goals</small>
          </div>
        </div>


        <div className="my-goal-stat blue">
          <IconBadge tone="blue">
            <TrendingUp size={29} />
          </IconBadge>

          <div>
            <span>Total Saved</span>
            <strong>
              {totalSaved.toFixed(2)} tUSDC
            </strong>
            <small>Progress so far</small>
          </div>
        </div>


        <div className="my-goal-stat orange">
          <IconBadge tone="orange">
            <Activity size={29} />
          </IconBadge>

          <div>
            <span>Avg Progress</span>
            <strong>
              {averageProgress.toFixed(2)}%
            </strong>
            <small>Overall progress</small>
          </div>
        </div>

      </div>


      {/* GOALS HEADER */}
      <div className="all-goals-header">

        <div>
          <h2>All Goals ({goals.length})</h2>
        </div>

        <div className="goals-view-label">
          <span>On-chain goals</span>
        </div>

      </div>


      {/* GOALS GRID */}
      {goals.length === 0 ? (

        <div className="my-goals-empty">

          <div className="my-goals-empty-icon">
            <Target size={38} />
          </div>

          <h2>No savings goals yet</h2>

          <p>
            Create your first goal and start building
            your decentralized savings plan.
          </p>

          <button
            className="primary-btn"
            onClick={onCreateGoal}
          >
            <Plus size={18} />
            Create Your First Goal
          </button>

        </div>

      ) : (

        <div className="goals-grid">

          {goals.map((goal) => {

            const progress = Math.min(
              100,
              Math.max(
                0,
                Number(goal.progress || 0)
              )
            );

            const status = goal.completed
              ? "Completed"
              : goal.active
              ? "Active"
              : "Withdrawn";

            const deadline = goal.deadline
              ? new Date(
                  Number(goal.deadline) * 1000
                ).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              : "—";

            return (
              <div
                className="goal-list-card"
                key={goal.id}
              >

                {/* CARD TOP */}
                <div className="goal-list-top">

                  <div className="goal-list-icon">
                    <Target size={27} />
                  </div>

                  <div className="goal-list-heading">

                    <div className="goal-list-name-row">

                      <h3>
                        {goal.name || `Goal #${goal.id + 1}`}
                      </h3>

                      <span
                        className={`goal-status ${
                          goal.completed
                            ? "completed"
                            : goal.active
                            ? "active"
                            : "withdrawn"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    <span className="goal-id">
                      Goal #{goal.id + 1}
                    </span>

                  </div>

                </div>


                {/* VALUES */}
                <div className="goal-list-values">

                  <div>
                    <span>Target</span>

                    <strong>
                      {Number(goal.target).toFixed(2)} tUSDC
                    </strong>
                  </div>

                  <div>
                    <span>Saved</span>

                    <strong className="saved-value">
                      {Number(goal.saved).toFixed(2)} tUSDC
                    </strong>
                  </div>

                </div>


                {/* PROGRESS */}
                <div className="goal-list-progress">

                  <div className="goal-progress-label">
                    <strong>
                      {progress.toFixed(0)}%
                    </strong>

                    <span>
                      {Number(goal.saved).toFixed(2)}
                      {" / "}
                      {Number(goal.target).toFixed(2)}
                      {" tUSDC"}
                    </span>
                  </div>

                  <div className="goal-progress-track">
                    <div
                      className="goal-progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                </div>


                {/* BOTTOM */}
                <div className="goal-list-bottom">

                  <div className="goal-deadline">
                    <span>Deadline</span>
                    <strong>{deadline}</strong>
                  </div>

                  <button
                    className="goal-view-btn"
                    onClick={() => {
                      if (!goal.completed && goal.active) {
                        onAddSavings(goal);
                      }
                    }}
                  >
                    {goal.completed
                      ? "Completed"
                      : goal.active
                      ? "Add Savings"
                      : "View Goal"}

                    {!goal.completed &&
                      goal.active && (
                        <ChevronRight size={16} />
                      )}
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      )}


      {/* SECURITY BANNER */}
      <div className="goals-security-banner">

        <div className="goals-security-icon">
          <ShieldCheck size={30} />
        </div>

        <div>
          <h3>
            Your goals are secured by Astra smart contracts.
          </h3>

          <p>
            All your savings are protected and transparently
            recorded on-chain.
          </p>
        </div>

      </div>

    </section>
  );
}

function SavingsPage({
  vaultData,
  usdcBalance,
  transactions,
  onDeposit,
  onWithdraw,
  onViewTransactions,
}) {
  const totalSavings = Number(vaultData?.total || 0);
  const principal = Number(vaultData?.principal || 0);
  const yieldEarned = Number(vaultData?.yield || 0);

  /*
   * Main savings balance = vault balance.
   * Available wallet balance = wallet tUSDC.
   */
  const availableBalance = Number(usdcBalance || 0);

  const savingsTransactions = transactions
    .filter((tx) =>
      [
        "Deposit to Savings",
        "Withdraw Savings",
        "Deposit",
        "Withdraw",
      ].some((name) =>
        tx.title?.includes(name)
      )
    )
    .slice(0, 4);

  const totalActivity = transactions.length;

  return (
    <section className="savings-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="savings-header">

        <div>
          <h1>Savings</h1>

          <p>
            Manage your savings and track your balances.
          </p>
        </div>

        <div className="savings-header-balance">

          <div className="savings-network">
            <span className="network-dot" />
            Sepolia
          </div>

          <button
            className="savings-refresh"
            onClick={onViewTransactions}
          >
            View Transactions
            <ArrowRight size={16} />
          </button>

        </div>

      </div>


      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="savings-summary-grid">

        {/* TOTAL SAVINGS */}
        <div className="savings-summary-card purple">

          <div className="savings-summary-icon">
            <Wallet size={24} />
          </div>

          <div>
            <span>Total Savings</span>

            <strong>
              {totalSavings.toFixed(2)} tUSDC
            </strong>

            <small>
              ≈ ${totalSavings.toFixed(2)} USD
            </small>
          </div>

        </div>


        {/* AVAILABLE */}
        <div className="savings-summary-card blue">

          <div className="savings-summary-icon">
            <WalletCards size={24} />
          </div>

          <div>
            <span>Available Balance</span>

            <strong>
              {availableBalance.toFixed(2)} tUSDC
            </strong>

            <small>
              Wallet balance
            </small>
          </div>

        </div>


        {/* PRINCIPAL */}
        <div className="savings-summary-card green">

          <div className="savings-summary-icon">
            <LockKeyhole size={24} />
          </div>

          <div>
            <span>Total Principal</span>

            <strong>
              {principal.toFixed(2)} tUSDC
            </strong>

            <small>
              Deposited savings
            </small>
          </div>

        </div>


        {/* YIELD */}
        <div className="savings-summary-card gold">

          <div className="savings-summary-icon">
            <TrendingUp size={24} />
          </div>

          <div>
            <span>Total Earned (Yield)</span>

            <strong>
              {yieldEarned.toFixed(4)} tUSDC
            </strong>

            <small>
              Earned from savings
            </small>
          </div>

        </div>

      </div>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="savings-main-grid">


        {/* ==================================
            SAVINGS OVERVIEW
        ================================== */}

        <div className="savings-overview-card">

          <div className="savings-card-header">

            <div>
              <h2>Savings Overview</h2>

              <p>
                Your current savings position
              </p>
            </div>

            <span className="savings-period">
              Current
            </span>

          </div>


          <div className="savings-big-number">

            <span>Total Savings</span>

            <strong>
              {totalSavings.toFixed(2)}
              <small> tUSDC</small>
            </strong>

          </div>


          {/* VISUAL BAR */}

          <div className="savings-visual">

            <div className="savings-visual-line">
              <span />
            </div>

            <div className="savings-visual-labels">

              <span>
                Principal
                <strong>
                  {principal.toFixed(2)} tUSDC
                </strong>
              </span>

              <span>
                Yield
                <strong>
                  {yieldEarned.toFixed(4)} tUSDC
                </strong>
              </span>

            </div>

          </div>


          {/* BOTTOM METRICS */}

          <div className="savings-overview-metrics">

            <div>
              <span>Total Deposited</span>

              <strong className="green-text">
                {principal.toFixed(2)} tUSDC
              </strong>
            </div>

            <div>
              <span>Yield Earned</span>

              <strong className="purple-text">
                {yieldEarned.toFixed(4)} tUSDC
              </strong>
            </div>

            <div>
              <span>Net Savings</span>

              <strong className="blue-text">
                {totalSavings.toFixed(2)} tUSDC
              </strong>
            </div>

          </div>

        </div>


        {/* ==================================
            RIGHT COLUMN
        ================================== */}

        <div className="savings-right-column">


          {/* QUICK ACTIONS */}

          <div className="savings-panel">

            <div className="savings-panel-title">
              <h2>Quick Actions</h2>
            </div>


            <button
              className="savings-action deposit"
              onClick={onDeposit}
            >

              <div className="savings-action-icon">
                <ArrowDownToLine size={21} />
              </div>

              <div>
                <strong>Deposit</strong>

                <span>
                  Add funds to your savings
                </span>
              </div>

              <ChevronRight size={18} />

            </button>


            <button
              className="savings-action withdraw"
              onClick={onWithdraw}
            >

              <div className="savings-action-icon">
                <ArrowUpRight size={21} />
              </div>

              <div>
                <strong>Withdraw</strong>

                <span>
                  Withdraw from your savings
                </span>
              </div>

              <ChevronRight size={18} />

            </button>

          </div>


          {/* BREAKDOWN */}

          <div className="savings-panel savings-breakdown">

            <div className="savings-panel-title">
              <h2>Savings Breakdown</h2>
            </div>


            <div className="breakdown-content">

              <div className="breakdown-ring">

                <div>
                  <strong>
                    {totalSavings.toFixed(2)}
                  </strong>

                  <span>tUSDC</span>

                  <small>Total</small>
                </div>

              </div>


              <div className="breakdown-legend">

                <div>

                  <span className="legend-dot purple-dot" />

                  <div>
                    <strong>
                      Principal
                    </strong>

                    <small>
                      {principal.toFixed(2)} tUSDC
                    </small>
                  </div>

                </div>


                <div>

                  <span className="legend-dot green-dot" />

                  <div>
                    <strong>
                      Yield
                    </strong>

                    <small>
                      {yieldEarned.toFixed(4)} tUSDC
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          RECENT SAVINGS ACTIVITY
      ====================================== */}

      <div className="savings-activity-card">

        <div className="savings-card-header">

          <div>
            <h2>Recent Savings Activity</h2>

            <p>
              Latest savings-related transactions.
            </p>
          </div>

          <button
            className="savings-view-all"
            onClick={onViewTransactions}
          >
            View All
            <ArrowRight size={15} />
          </button>

        </div>


        <div className="savings-activity-table">

          <div className="savings-activity-header">

            <span>Type</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Status</span>

          </div>


          {savingsTransactions.length === 0 ? (

            <div className="savings-empty">
              <Wallet size={30} />

              <h3>
                No savings activity yet
              </h3>

              <p>
                Your deposits and withdrawals
                will appear here.
              </p>
            </div>

          ) : (

            savingsTransactions.map((tx, index) => {

              const isWithdraw =
                tx.title?.toLowerCase()
                  .includes("withdraw");

              return (
                <div
                  className="savings-activity-row"
                  key={
                    tx.transactionHash
                      ? `${tx.transactionHash}-${index}`
                      : index
                  }
                >

                  <div className="activity-type">

                    <div
                      className={
                        isWithdraw
                          ? "activity-icon withdraw"
                          : "activity-icon deposit"
                      }
                    >
                      {isWithdraw ? (
                        <ArrowUpRight size={17} />
                      ) : (
                        <ArrowDownToLine size={17} />
                      )}
                    </div>

                    <strong>
                      {isWithdraw
                        ? "Withdraw"
                        : "Deposit"}
                    </strong>

                  </div>


                  <div className="activity-description">

                    <strong>
                      {tx.title}
                    </strong>

                    <span>
                      Savings transaction
                    </span>

                  </div>


                  <div
                    className={
                      isWithdraw
                        ? "activity-amount negative"
                        : "activity-amount positive"
                    }
                  >
                    {tx.detail}
                  </div>


                  <div className="activity-date">
                    {tx.meta || "—"}
                  </div>


                  <div>
                    <span className="activity-status">
                      Success
                    </span>
                  </div>

                </div>
              );
            })

          )}

        </div>

      </div>

    </section>
  );
}

function AnalyticsPage({
  transactions = [],
  goals = [],
  vaultData = {},
}) {
  const getAmount = (tx) => {
    const match = String(tx?.detail || "").match(/[\d.]+/);
    return match ? Number(match[0]) : 0;
  };

  const deposits = transactions.filter((tx) => {
    const title = String(tx?.title || "").toLowerCase();

    return (
      title.includes("deposit") ||
      title.includes("add savings")
    );
  });

  const withdrawals = transactions.filter((tx) => {
    const title = String(tx?.title || "").toLowerCase();

    return title.includes("withdraw");
  });

  const yieldTransactions = transactions.filter((tx) =>
    String(tx?.title || "")
      .toLowerCase()
      .includes("yield")
  );

  const totalDeposited = deposits.reduce(
    (sum, tx) => sum + getAmount(tx),
    0
  );

  const totalWithdrawn = withdrawals.reduce(
    (sum, tx) => sum + getAmount(tx),
    0
  );

  const averageDeposit =
    deposits.length > 0
      ? totalDeposited / deposits.length
      : 0;

  const netSavings =
    totalDeposited - totalWithdrawn;

  const principal = Number(vaultData?.principal || 0);
  const yieldEarned = Number(vaultData?.yield || 0);

  const yieldEfficiency =
    principal > 0
      ? (yieldEarned / principal) * 100
      : 0;

  const savingsGrowth =
    totalDeposited > 0
      ? (netSavings / totalDeposited) * 100
      : 0;

  const activityScore = Math.min(
    100,
    deposits.length * 10
  );

  /* ---------------------------------------
     MOST ACTIVE DAY
  --------------------------------------- */

  const dayCounts = {};

  deposits.forEach((tx) => {
    if (!tx?.meta) return;

    const date = new Date(tx.meta);

    if (Number.isNaN(date.getTime())) return;

    const day = date.toLocaleDateString(
      "en-US",
      { weekday: "long" }
    );

    dayCounts[day] =
      (dayCounts[day] || 0) + 1;
  });

  const mostActiveDay =
    Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Not enough data";

  /* ---------------------------------------
     CHART DATA
  --------------------------------------- */

  const chartTransactions = [...transactions]
    .filter((tx) => getAmount(tx) > 0)
    .sort(
      (a, b) =>
        Number(a.blockNumber || 0) -
        Number(b.blockNumber || 0)
    )
    .slice(-12);

  const maxChartAmount = Math.max(
    ...chartTransactions.map(getAmount),
    1
  );

  /* ---------------------------------------
     INSIGHT
  --------------------------------------- */

  let insight;

  if (transactions.length === 0) {
    insight =
      "Start saving to unlock personalized analytics based on your on-chain activity.";
  } else if (savingsGrowth >= 70) {
    insight =
      "Your savings activity is trending positively. Keep maintaining your current contribution pattern.";
  } else if (savingsGrowth >= 30) {
    insight =
      "Your savings are building steadily. Increasing contribution consistency could improve your overall progress.";
  } else {
    insight =
      "Your savings activity is still developing. Regular contributions can strengthen your savings trajectory.";
  }

  return (
    <section className="analytics-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="analytics-header">

        <div>
          <h1>Analytics</h1>

          <p>
            Understand your savings patterns
            and performance.
          </p>
        </div>

        <div className="analytics-live">
          <span />
          Live On-Chain Data
        </div>

      </div>


      {/* ====================================
          KPI CARDS
      ==================================== */}

      <div className="analytics-kpi-grid">

        <div className="analytics-kpi-card growth">

          <div className="analytics-kpi-icon">
            <TrendingUp size={21} />
          </div>

          <span>Savings Growth</span>

          <strong>
            {savingsGrowth.toFixed(1)}%
          </strong>

          <small>
            Net savings growth
          </small>

        </div>


        <div className="analytics-kpi-card deposited">

          <div className="analytics-kpi-icon">
            <ArrowDownToLine size={21} />
          </div>

          <span>Total Deposited</span>

          <strong>
            {totalDeposited.toFixed(2)}
            {" "}tUSDC
          </strong>

          <small>
            {deposits.length} transactions
          </small>

        </div>


        <div className="analytics-kpi-card withdrawn">

          <div className="analytics-kpi-icon">
            <ArrowUpRight size={21} />
          </div>

          <span>Total Withdrawn</span>

          <strong>
            {totalWithdrawn.toFixed(2)}
            {" "}tUSDC
          </strong>

          <small>
            {withdrawals.length} transactions
          </small>

        </div>


        <div className="analytics-kpi-card yield">

          <div className="analytics-kpi-icon">
            <Zap size={21} />
          </div>

          <span>Yield Earned</span>

          <strong>
            {yieldEarned.toFixed(4)}
            {" "}tUSDC
          </strong>

          <small>
            From yield activity
          </small>

        </div>

      </div>


      {/* ====================================
          SAVINGS ACTIVITY
      ==================================== */}

      <div className="analytics-card">

        <div className="analytics-card-heading">

          <div>
            <h2>Savings Activity Over Time</h2>

            <p>
              Deposits and withdrawals from
              recorded blockchain activity.
            </p>
          </div>

          <div className="analytics-net">
            Net{" "}
            {netSavings >= 0 ? "+" : ""}
            {netSavings.toFixed(2)} tUSDC
          </div>

        </div>


        <div className="analytics-chart">

          {chartTransactions.length === 0 ? (

            <div className="analytics-empty">

              <BarChart3 size={34} />

              <strong>
                Not enough activity yet
              </strong>

              <span>
                Your blockchain activity will
                appear here.
              </span>

            </div>

          ) : (

            <div className="analytics-bars">

              {chartTransactions.map((tx, index) => {

                const amount = getAmount(tx);

                const isWithdrawal =
                  String(tx?.title || "")
                    .toLowerCase()
                    .includes("withdraw");

                const height =
                  Math.max(
                    12,
                    (amount / maxChartAmount) * 150
                  );

                return (
                  <div
                    className="analytics-bar-wrapper"
                    key={
                      tx.transactionHash ||
                      index
                    }
                  >

                    <div
                      className={
                        isWithdrawal
                          ? "analytics-bar withdrawal"
                          : "analytics-bar deposit"
                      }
                      style={{
                        height: `${height}px`,
                      }}
                    />

                    <span>
                      {isWithdrawal
                        ? "Out"
                        : "In"}
                    </span>

                  </div>
                );
              })}

            </div>

          )}

        </div>


        <div className="analytics-legend">

          <span>
            <i className="deposit-dot" />
            Deposits
          </span>

          <span>
            <i className="withdraw-dot" />
            Withdrawals
          </span>

        </div>

      </div>


      {/* ====================================
          GOALS + BEHAVIOR
      ==================================== */}

      <div className="analytics-grid-2">


        {/* GOAL PERFORMANCE */}

        <div className="analytics-card">

          <div className="analytics-card-heading">

            <div>
              <h2>Goal Performance</h2>

              <p>
                Progress across your goals.
              </p>
            </div>

            <Target size={20} />

          </div>


          <div className="analytics-goals">

            {goals.length === 0 ? (

              <div className="analytics-small-empty">
                No goals available.
              </div>

            ) : (

              goals.map((goal, index) => {

                const target =
                  Number(goal?.target || 0);

                const saved =
                  Number(goal?.saved || 0);

                const progress =
                  target > 0
                    ? Math.min(
                        100,
                        (saved / target) * 100
                      )
                    : Number(
                        goal?.progress || 0
                      );

                return (
                  <div
                    className="analytics-goal-row"
                    key={
                      goal?.id ??
                      index
                    }
                  >

                    <div className="analytics-goal-info">

                      <strong>
                        {goal?.name ||
                          `Goal #${index + 1}`}
                      </strong>

                      <span>
                        {saved.toFixed(2)}
                        {" / "}
                        {target.toFixed(2)}
                        {" tUSDC"}
                      </span>

                    </div>


                    <div className="analytics-goal-progress">

                      <div className="analytics-progress-track">

                        <div
                          className="analytics-progress-fill"
                          style={{
                            width:
                              `${progress}%`,
                          }}
                        />

                      </div>

                    </div>


                    <strong className="analytics-goal-percent">
                      {progress.toFixed(0)}%
                    </strong>

                  </div>
                );
              })

            )}

          </div>

        </div>


        {/* SAVINGS BEHAVIOR */}

        <div className="analytics-card">

          <div className="analytics-card-heading">

            <div>
              <h2>Savings Behavior</h2>

              <p>
                Derived from your activity.
              </p>
            </div>

            <Activity size={20} />

          </div>


          <div className="analytics-behavior">

            <div className="analytics-behavior-row">

              <span>
                Average Deposit
              </span>

              <strong>
                {averageDeposit.toFixed(2)}
                {" "}tUSDC
              </strong>

            </div>


            <div className="analytics-behavior-row">

              <span>
                Number of Deposits
              </span>

              <strong>
                {deposits.length}
              </strong>

            </div>


            <div className="analytics-behavior-row">

              <span>
                Number of Withdrawals
              </span>

              <strong>
                {withdrawals.length}
              </strong>

            </div>


            <div className="analytics-behavior-row">

              <span>
                Most Active Day
              </span>

              <strong>
                {mostActiveDay}
              </strong>

            </div>


            <div className="analytics-behavior-row">

              <span>
                Activity Score
              </span>

              <strong>
                {activityScore}/100
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================
          YIELD PERFORMANCE
      ==================================== */}

      <div className="analytics-card">

        <div className="analytics-card-heading">

          <div>
            <h2>Yield Performance</h2>

            <p>
              Your earnings from the yield pool.
            </p>
          </div>

          <div className="analytics-yield-label">
            <Zap size={15} />
            Yield
          </div>

        </div>


        <div className="analytics-yield-grid">

          <div>
            <span>Yield Earned</span>

            <strong>
              {yieldEarned.toFixed(4)}
              {" "}tUSDC
            </strong>

            <small>
              Total earned
            </small>
          </div>


          <div>
            <span>Principal</span>

            <strong>
              {principal.toFixed(2)}
              {" "}tUSDC
            </strong>

            <small>
              Savings principal
            </small>
          </div>


          <div>
            <span>Yield / Principal</span>

            <strong>
              {yieldEfficiency.toFixed(2)}%
            </strong>

            <small>
              Earnings ratio
            </small>
          </div>


          <div>
            <span>Yield Transactions</span>

            <strong>
              {yieldTransactions.length}
            </strong>

            <small>
              Recorded activity
            </small>
          </div>

        </div>

      </div>


      {/* ====================================
          ASTRA INSIGHT
      ==================================== */}

      <div className="analytics-insight">

        <div className="analytics-insight-icon">
          <Zap size={22} />
        </div>

        <div>

          <span>Astra Insight</span>

          <h3>
            {insight}
          </h3>

          <p>
            This insight is calculated from
            your recorded on-chain activity.
          </p>

        </div>

      </div>

    </section>
  );
}

function SettingsPage({
  walletAddress,
  disconnectWallet,
}) {
  const [confirmTransactions, setConfirmTransactions] =
    React.useState(
      localStorage.getItem("astra_confirm_transactions") !== "false"
    );

  const [autoRefresh, setAutoRefresh] =
    React.useState(
      localStorage.getItem("astra_auto_refresh") !== "false"
    );

  const [notifications, setNotifications] =
    React.useState(
      localStorage.getItem("astra_notifications") !== "false"
    );

  const [compactTransactions, setCompactTransactions] =
    React.useState(
      localStorage.getItem("astra_compact_transactions") !== "false"
    );

  const [copied, setCopied] = React.useState("");

  const vaultContract =
    "0x3ea3cdc400b362f0f34b0435c3abec0628d68ac8";

  const goalVaultContract =
    "0x8f57e8f4e1b1c7a93e9b6adf5cbb8c2a4d7f1e2a";

  const chainId = "11155111";

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Not connected";

  const savePreference = (key, value) => {
    localStorage.setItem(key, String(value));
  };

  const copyText = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const resetPreferences = () => {
    localStorage.removeItem("astra_confirm_transactions");
    localStorage.removeItem("astra_auto_refresh");
    localStorage.removeItem("astra_notifications");
    localStorage.removeItem("astra_compact_transactions");

    setConfirmTransactions(true);
    setAutoRefresh(true);
    setNotifications(true);
    setCompactTransactions(true);
  };

  const clearLocalData = () => {
    const confirmed = window.confirm(
      "Clear Astra local preferences and cached data?"
    );

    if (!confirmed) return;

    localStorage.clear();

    setConfirmTransactions(true);
    setAutoRefresh(true);
    setNotifications(true);
    setCompactTransactions(true);
  };

  const openExplorer = () => {
    window.open(
      `https://sepolia.etherscan.io/address/${vaultContract}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="settings-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="settings-header">

        <div>
          <h1>Settings</h1>

          <p>
            Manage your account, preferences and
            app configuration.
          </p>
        </div>

      </div>


      {/* =====================================
          1. ACCOUNT / WALLET
      ===================================== */}

      <div className="settings-card settings-account-card">

        <div className="settings-section-title">
          <h2>1. Account / Wallet</h2>
        </div>


        <div className="settings-account-content">

          <div className="settings-wallet-section">

            <div className="settings-large-icon purple">
              <Wallet size={25} />
            </div>

            <div className="settings-wallet-info">

              <span>Connected Wallet</span>

              <div className="settings-address-row">

                <strong>
                  {walletAddress || "Not connected"}
                </strong>

                {walletAddress && (
                  <button
                    className="settings-copy-button"
                    onClick={() =>
                      copyText(
                        walletAddress,
                        "wallet"
                      )
                    }
                    title="Copy wallet address"
                  >
                    {copied === "wallet" ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}
                  </button>
                )}

              </div>

              <div className="settings-connected-badge">
                <span />
                {walletAddress
                  ? "Connected"
                  : "Not Connected"}
              </div>

            </div>

          </div>


          <div className="settings-account-divider" />


          <div className="settings-network-section">

            <div className="settings-large-icon blue">
              <Globe2 size={25} />
            </div>

            <div>

              <span>Network</span>

              <strong>
                Sepolia Testnet
              </strong>

              <small>
                Chain ID: {chainId}
              </small>

            </div>

          </div>


          <button
            className="settings-danger-button"
            onClick={disconnectWallet}
            disabled={!walletAddress}
          >
            <LogOut size={16} />
            Disconnect Wallet
          </button>

        </div>

      </div>


      {/* =====================================
          2 + 3
      ===================================== */}

      <div className="settings-two-column">


        {/* TRANSACTION PREFERENCES */}

        <div className="settings-card">

          <div className="settings-section-title">
            <h2>2. Transaction Preferences</h2>
          </div>


          <div className="settings-option-list">

            <label className="settings-option">

              <div className="settings-option-icon purple">
                <ShieldCheck size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Confirm before transactions
                </strong>

                <span>
                  Ask for confirmation before
                  sending a transaction.
                </span>

              </div>

              <button
                type="button"
                className={
                  `settings-toggle ${
                    confirmTransactions
                      ? "active"
                      : ""
                  }`
                }
                onClick={() => {
                  const value =
                    !confirmTransactions;

                  setConfirmTransactions(value);

                  savePreference(
                    "astra_confirm_transactions",
                    value
                  );
                }}
              >
                <span />
              </button>

            </label>


            <label className="settings-option">

              <div className="settings-option-icon blue">
                <RefreshCw size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Auto-refresh blockchain data
                </strong>

                <span>
                  Automatically refresh balances
                  and transaction data.
                </span>

              </div>

              <button
                type="button"
                className={
                  `settings-toggle ${
                    autoRefresh ? "active" : ""
                  }`
                }
                onClick={() => {
                  const value = !autoRefresh;

                  setAutoRefresh(value);

                  savePreference(
                    "astra_auto_refresh",
                    value
                  );
                }}
              >
                <span />
              </button>

            </label>


            <label className="settings-option">

              <div className="settings-option-icon green">
                <Bell size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Transaction notifications
                </strong>

                <span>
                  Show success and failure
                  notifications.
                </span>

              </div>

              <button
                type="button"
                className={
                  `settings-toggle ${
                    notifications ? "active" : ""
                  }`
                }
                onClick={() => {
                  const value = !notifications;

                  setNotifications(value);

                  savePreference(
                    "astra_notifications",
                    value
                  );
                }}
              >
                <span />
              </button>

            </label>

          </div>

        </div>


        {/* DISPLAY PREFERENCES */}

        <div className="settings-card">

          <div className="settings-section-title">
            <h2>3. Display Preferences</h2>
          </div>


          <div className="settings-option-list">


            <div className="settings-display-row">

              <div className="settings-option-icon purple">
                <Moon size={18} />
              </div>

              <div className="settings-option-text">

                <strong>Theme</strong>

                <span>
                  Choose your preferred theme.
                </span>

              </div>

              <div className="settings-select">
                Dark
                <ChevronDown size={14} />
              </div>

            </div>


            <div className="settings-display-row">

              <div className="settings-option-icon blue">
                <Palette size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Currency Display
                </strong>

                <span>
                  Choose how amounts are displayed.
                </span>

              </div>

              <div className="settings-select">
                tUSDC
                <ChevronDown size={14} />
              </div>

            </div>


            <div className="settings-display-row">

              <div className="settings-option-icon green">
                <List size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Compact Transaction List
                </strong>

                <span>
                  Show more items in transaction lists.
                </span>

              </div>

              <button
                type="button"
                className={
                  `settings-toggle ${
                    compactTransactions
                      ? "active"
                      : ""
                  }`
                }
                onClick={() => {
                  const value =
                    !compactTransactions;

                  setCompactTransactions(value);

                  savePreference(
                    "astra_compact_transactions",
                    value
                  );
                }}
              >
                <span />
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          4. NETWORK & BLOCKCHAIN
      ===================================== */}

      <div className="settings-card">

        <div className="settings-section-title">
          <h2>4. Network & Blockchain</h2>
        </div>


        <div className="settings-blockchain-content">

          <div className="settings-blockchain-intro">

            <div className="settings-large-icon blue">
              <Globe2 size={28} />
            </div>

            <h3>
              Network Information
            </h3>

            <p>
              Current blockchain network and
              smart contract details.
            </p>

          </div>


          <div className="settings-blockchain-details">

            <div className="settings-detail-row">
              <span>Network</span>
              <strong>Sepolia Testnet</strong>
            </div>

            <div className="settings-detail-row">
              <span>Chain ID</span>
              <strong>{chainId}</strong>
            </div>


            <div className="settings-detail-row">

              <span>Astra Vault Contract</span>

              <div className="settings-contract">

                <strong>
                  {vaultContract.slice(0, 10)}
                  ...
                  {vaultContract.slice(-8)}
                </strong>

                <button
                  onClick={() =>
                    copyText(
                      vaultContract,
                      "vault"
                    )
                  }
                >
                  {copied === "vault" ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>

              </div>

            </div>


            <div className="settings-detail-row">

              <span>Astra Goal Vault Contract</span>

              <div className="settings-contract">

                <strong>
                  {goalVaultContract.slice(0, 10)}
                  ...
                  {goalVaultContract.slice(-8)}
                </strong>

                <button
                  onClick={() =>
                    copyText(
                      goalVaultContract,
                      "goal"
                    )
                  }
                >
                  {copied === "goal" ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>

              </div>

            </div>


            <div className="settings-detail-row">

              <span>Block Explorer</span>

              <button
                className="settings-explorer-button"
                onClick={openExplorer}
              >
                View on Sepolia Etherscan
                <ExternalLink size={14} />
              </button>

            </div>

          </div>

        </div>


        <div className="settings-network-notice">

          <Info size={17} />

          <span>
            You are connected to Sepolia Testnet.
            All transactions are recorded on the
            test network.
          </span>

        </div>

      </div>


      {/* =====================================
          5 + 6
      ===================================== */}

      <div className="settings-two-column">


        {/* SECURITY */}

        <div className="settings-card">

          <div className="settings-section-title">
            <h2>5. Security & Privacy</h2>
          </div>


          <div className="settings-management-list">


            <div className="settings-management-row">

              <div className="settings-option-icon purple">
                <LockKeyhole size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Wallet Security
                </strong>

                <span>
                  Your private keys are secured
                  by MetaMask.
                </span>

              </div>

              <ChevronRight size={16} />

            </div>


            <div className="settings-management-row">

              <div className="settings-option-icon red">
                <ShieldAlert size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Revoke & Disconnect
                </strong>

                <span>
                  Disconnect your wallet from Astra.
                </span>

              </div>

              <button
                className="settings-small-danger"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>

            </div>


            <div className="settings-management-row">

              <div className="settings-option-icon gold">
                <ShieldCheck size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Privacy Information
                </strong>

                <span>
                  Blockchain transactions are
                  publicly recorded.
                </span>

              </div>

              <ChevronRight size={16} />

            </div>

          </div>

        </div>


        {/* DATA MANAGEMENT */}

        <div className="settings-card">

          <div className="settings-section-title">
            <h2>6. Data & Management</h2>
          </div>


          <div className="settings-management-list">


            <div className="settings-management-row">

              <div className="settings-option-icon blue">
                <Trash2 size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Clear Local Data
                </strong>

                <span>
                  Remove locally stored preferences.
                </span>

              </div>

              <button
                className="settings-small-danger"
                onClick={clearLocalData}
              >
                Clear
              </button>

            </div>


            <div className="settings-management-row">

              <div className="settings-option-icon gold">
                <RotateCcw size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Reset App Preferences
                </strong>

                <span>
                  Reset settings to default values.
                </span>

              </div>

              <button
                className="settings-small-button"
                onClick={resetPreferences}
              >
                Reset
              </button>

            </div>


            <div className="settings-management-row">

              <div className="settings-option-icon green">
                <Download size={18} />
              </div>

              <div className="settings-option-text">

                <strong>
                  Export Transaction History
                </strong>

                <span>
                  Available from the Transactions page.
                </span>

              </div>

              <span className="settings-coming-soon">
                Coming Soon
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================
          7. ABOUT ASTRA
      ===================================== */}

      <div className="settings-card settings-about">

        <div className="settings-section-title">
          <h2>7. About Astra</h2>
        </div>


        <div className="settings-about-content">

          <div className="settings-about-brand">

            <div className="settings-about-logo">
              <Zap size={28} />
            </div>

            <div>

              <h3>Astra</h3>

              <strong>
                Decentralized Savings Platform
              </strong>

              <p>
                A secure and transparent way to
                save, achieve goals and earn yield
                on-chain.
              </p>

            </div>

          </div>


          <div className="settings-about-details">

            <div>
              <span>Version</span>
              <strong>1.0.0</strong>
            </div>

            <div>
              <span>Environment</span>
              <strong>Sepolia Testnet</strong>
            </div>

            <div>
              <span>Smart Contracts</span>
              <strong className="settings-verified">
                Verified ✓
              </strong>
            </div>

            <div>
              <span>Platform</span>
              <strong>Web Application</strong>
            </div>

            <div>
              <span>Built With</span>
              <strong>
                React • Ethers.js • Solidity
              </strong>
            </div>

          </div>

        </div>

      </div>

    </section>
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
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalData, setGoalData] = useState([]);
  const currentGoal = goalData[0] || null;
  const [yieldPool, setYieldPool] = useState("0.00");

  useEffect(() => {
    if (active === "Yield Pool" && walletConnected) {
      getYieldPool()
        .then((pool) => setYieldPool(pool))
        .catch((error) => {
          console.error("Failed to load yield pool:", error);
        });
    }
  }, [active, walletConnected]);

  const [recentTransactions, setRecentTransactions] = useState([]);

  const nav = useMemo(() => [
    ["Dashboard", Home],
    ["My Goals", Target],
    ["Savings", Wallet],
    ["Transactions", SlidersHorizontal],
    ["Yield Pool", Coins],
    ["Analytics", BarChart3],
    ["Settings", Settings],
    
  ], []);

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(window.__astraToast);
    window.__astraToast = window.setTimeout(() => setToast(""), 2400);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress("");
    setUsdcBalance("0.00");

    setVaultData({
      principal: "0.00",
      yield: "0.00",
      total: "0.00",
    });

    setGoalData([]);
    setRecentTransactions([]);
    setYieldPool("0.00");

    notify("Wallet disconnected");
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

      const pool = await getYieldPool();
      setYieldPool(pool);

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

      const updatedGoals = await getGoalData(walletAddress);
      setGoalData(updatedGoals);

      const txs = await getRecentTransactions(walletAddress);
      setRecentTransactions(txs);

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
        {active === "Yield Pool" ? (
          <YieldPoolPage
            yieldPool={yieldPool}
            walletConnected={walletConnected}
            usdcBalance={usdcBalance}
            setShowAction={setShowAction}
          />
        ) : active === "Transactions" ? (

          <TransactionsPage
            transactions={recentTransactions}
            usdcBalance={usdcBalance}
            onRefresh={refresh}
            transactionLoading={refreshing}
          />
        
        ) : active === "My Goals" ? (

          <MyGoalsPage
            goals={goalData}
            onCreateGoal={() => setShowCreate(true)}
            onAddSavings={(goal) => {
              setSelectedGoal(goal);
              setShowAction("add");
            }}
            onWithdraw={(goal) => {
              setShowAction("withdraw");
            }}
          />

        ) : active === "Savings" ? (

          <SavingsPage
            vaultData={vaultData}
            usdcBalance={usdcBalance}
            transactions={recentTransactions}
            onDeposit={() => setShowAction("deposit")}
            onWithdraw={() => setShowAction("withdraw")}
            onViewTransactions={() => setActive("Transactions")}
          />

        ) : active === "Analytics" ? (

          <AnalyticsPage
            transactions={recentTransactions}
            goals={goalData}
            vaultData={vaultData}
          />

        ) : active === "Settings" ? (

          <SettingsPage
            walletAddress={walletAddress}
            disconnectWallet={disconnectWallet}
          />

        ) : (
          <>
              
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
                value={goalData.filter((goal) => goal.active && !goal.completed).length}
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
                        <h2>{currentGoal ? currentGoal.name : "No Goal Yet"}</h2>
                        <span className="status-pill">{currentGoal?.completed ? "Completed" : Number(currentGoal?.saved || 0) > 0 ? "Active" : "Withdrawn"}</span>
                      </div>
                      <div className="goal-target">Target: {currentGoal ? Number(currentGoal.target).toFixed(2) : "0.00"} tUSDC</div>
                    </div>
                    <button className="dots-btn" onClick={() => notify("Goal options opened")}>•••</button>
                  </div>

                  <div className="progress-row">
                    <div>
                      <strong>
                        {currentGoal ? Number(currentGoal.saved).toFixed(2) : "0.00"}
                      </strong>{" "}
                      /{" "}
                      {currentGoal ? Number(currentGoal.target).toFixed(2) : "0.00"}{" "}
                      <span>tUSDC</span>
                    </div>

                    <strong>
                      {currentGoal ? currentGoal.progress : 0}%
                    </strong>
                  </div>
                  <div className="progress-track"><div className="progress-fill" style={{width: `${currentGoal ? currentGoal.progress : 0}%`}} /></div>

                  <div className="goal-metrics">
                    <div><span>Saved Amount</span><strong className="cyan-text">{currentGoal ? Number(currentGoal.saved).toFixed(2) : "0.00"} tUSDC</strong></div>
                    <div><span>Yield Earned</span><strong className="green-text">{currentGoal ? Number(currentGoal.yield).toFixed(6) : "0.000000"} tUSDC</strong></div>
                    <div><span>Monthly Yield</span><strong className="orange-text">{currentGoal ? (Number(currentGoal.target) * 0.05 / 12).toFixed(6) : "0.000000"}{" "} tUSDC</strong></div>
                    <div><span>Deadline</span>
                      <strong className="pink-text">
                        {currentGoal
                          ? new Date(currentGoal.deadline * 1000).toLocaleDateString(
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
                    <div><span>Total Goals</span><strong>{currentGoal ? 1 : 0}</strong></div>
                  </div>
                  <div>
                    <Check size={28}/>
                    <div><span>Completed Goals</span><strong>{currentGoal?.completed ? 1 : 0}</strong></div>
                  </div>
                  <div>
                    <div className="ring"><span>{currentGoal ? currentGoal.progress : 0}%</span></div>
                    <div><span>Completion Rate</span><strong>{currentGoal ? currentGoal.progress : 0}%</strong></div>
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
                    recentTransactions.slice(0, 3).map((tx, i) => (
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
          </>
        )}
      </main>

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

                      if (!currentGoal) {
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
                        selectedGoal.id,
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

                      if (!selectedGoal) {
                        notify("Select a goal first");
                        return;
                      }

                      setTransactionLoading(true);

                      notify(
                        "Confirm the withdrawal transaction in MetaMask..."
                      );

                      await withdrawGoalOnChain(
                        currentGoal.id
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
            ) : showAction === "yield" ? (
              <>
                <h3>Fund Yield Pool</h3>

                <p>
                  Add tUSDC to the Astra yield pool to provide liquidity
                  for goal withdrawals.
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
                    placeholder="1"
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

                      if (
                        !goalFundingAmount ||
                        Number(goalFundingAmount) <= 0
                      ) {
                        notify("Enter a valid amount");
                        return;
                      }

                      setTransactionLoading(true);

                      notify(
                        "Confirm the yield pool transaction in MetaMask..."
                      );

                      await fundYieldOnChain(
                        goalFundingAmount
                      );

                      const balance = await getUSDCBalance(
                        walletAddress
                      );

                      setUsdcBalance(balance);

                      setShowAction(null);

                      notify("Yield pool funded successfully!");

                    } catch (error) {
                      console.error(
                        "Yield pool funding failed:",
                        error
                      );

                      notify(
                        error?.reason ||
                        error?.shortMessage ||
                        "Yield pool funding failed"
                      );
                    } finally {
                      setTransactionLoading(false);
                    }
                  }}
                >
                  {transactionLoading
                    ? "Processing..."
                    : "Fund Yield Pool"}
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

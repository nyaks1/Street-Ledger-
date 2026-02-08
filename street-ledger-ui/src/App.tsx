import { ConnectButton } from "@mysten/dapp-kit-react";
import { CreateDebtForm } from "./components/CreateDebtForm";
import { WalletStatus } from "./WalletStatus";

function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black">
      {/* Sticky Header with Street Ledger Brand */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-black font-black">SL</div>
             <h1 className="text-xl font-black tracking-tighter uppercase">Street Ledger</h1>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl space-y-12">
        {/* Welcome Section */}
        <section className="space-y-4 text-center">
          <h2 className="text-5xl font-black leading-tight">
            Track your debts <br/>
            <span className="text-yellow-500">on the block.</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Stop losing money on small favors. Record, verify, and settle informal debts instantly.
          </p>
        </section>

        {/* Current Wallet Context */}
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <WalletStatus />
        </div>

        {/* The Action Form */}
        <CreateDebtForm />
        
        {/* We will place the DebtList here next! */}
      </main>
    </div>
  );
}

export default App;
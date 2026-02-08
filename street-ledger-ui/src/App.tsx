import { useEffect, useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { CreateDebtForm } from "./components/CreateDebtForm";
import { OwnedObjects } from "./OwnedObjects"; 
import { MOCK_MODE, MockDebt } from "./config"; // Check if this is ./config or ../config

function App() {
  const account = useCurrentAccount();
  const [debts, setDebts] = useState<MockDebt[]>([]);

  // This function fetches the total for the stats banner
  const updateStats = () => {
    if (MOCK_MODE) {
      const data = JSON.parse(localStorage.getItem("mock_debts") || "[]");
      setDebts(data);
    }
  };

  useEffect(() => {
    updateStats();
    window.addEventListener("storage", updateStats);
    return () => window.removeEventListener("storage", updateStats);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      {/* --- NAVBAR --- */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-black text-xl">SL</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Street Ledger</h1>
          </div>
          <ConnectButton />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!account ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
            <h2 className="text-4xl font-bold mb-4 text-zinc-200">Wallet Disconnected</h2>
            <p className="text-zinc-500 max-w-md mx-auto">Connect your wallet to start tracking favors and settling debts on the Sui network.</p>
          </div>
        ) : (
          <>
            {/* --- STATS BANNER (Now inside the fragment) --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl">
                <p className="text-zinc-500 text-xs uppercase font-bold">Total Hustle</p>
                <p className="text-3xl font-black text-yellow-500">{debts.length} Debts</p>
              </div>
              <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl">
                <p className="text-zinc-500 text-xs uppercase font-bold">Total Owed</p>
                <p className="text-3xl font-black text-green-500">
                  {debts.reduce((acc, d) => acc + d.amount_owed, 0).toLocaleString()} MIST
                </p>
              </div>
              <div className="p-1.5 px-6 bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-col justify-center">
                <p className="text-zinc-500 text-xs uppercase font-bold">System Status</p>
                <p className="text-2xl font-black text-blue-500">MOCK-NET v1.0</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: The Action Zone */}
              <div className="lg:col-span-5 space-y-8">
                <CreateDebtForm />
              </div>

              {/* RIGHT: The Data Zone */}
              <div className="lg:col-span-7 space-y-8">
                <OwnedObjects />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="py-10 border-t border-zinc-900 text-center text-zinc-600 text-sm">
        Built for Hackathon • Street Ledger © 2026
      </footer>
    </div>
  );
}

export default App;
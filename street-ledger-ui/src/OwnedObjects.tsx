import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Package, Loader2, CheckCircle2, Clock } from "lucide-react";
import { MOCK_MODE, MockDebt } from "./config";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const [mockDebts, setMockDebts] = useState<MockDebt[]>([]);

  // 1. Logic to load local data
  const loadMockData = () => {
    const data = JSON.parse(localStorage.getItem("mock_debts") || "[]");
    setMockDebts(data);
  };

  // 2. Listen for changes (when you add or settle a debt)
  useEffect(() => {
    if (MOCK_MODE) {
      loadMockData();
      window.addEventListener("storage", loadMockData);
      return () => window.removeEventListener("storage", loadMockData);
    }
  }, []);

  // 3. Keep the real query logic alive (just in case)
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: account?.address || "" },
    { enabled: !!account && !MOCK_MODE }
  );

  const handleSettle = (id: string) => {
    const existing = JSON.parse(localStorage.getItem("mock_debts") || "[]");
    const updated = existing.filter((d: MockDebt) => d.id !== id);
    localStorage.setItem("mock_debts", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    alert("Debt Settled! Street Credit Updated. 📈");
  };

  if (!account) {
    return (
      <div className="p-10 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800 text-center text-zinc-500 italic">
        "Your word is your bond, but a ledger is better." <br />
        Connect Slush to see your records.
      </div>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-zinc-800 bg-zinc-900/50 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-tighter italic text-xl">
              <Package className="h-5 w-5" />
              The Street Ledger
            </CardTitle>
            <CardDescription className="text-zinc-500 font-medium">
              {MOCK_MODE ? "Local Records (Mock-Net)" : "Live Sui Testnet Assets"}
            </CardDescription>
          </div>
          {MOCK_MODE && (
             <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Total Owed</p>
                <p className="text-xl font-black text-green-500">
                    {mockDebts.reduce((acc, d) => acc + d.amount_owed, 0).toLocaleString()} MIST
                </p>
             </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* MOCK MODE RENDER */}
        {MOCK_MODE ? (
          <div className="space-y-3">
            {mockDebts.length === 0 ? (
              <p className="text-zinc-600 italic py-10 text-center">No active debts found. Start a new hustle!</p>
            ) : (
              mockDebts.map((debt) => (
                <div key={debt.id} className="p-4 bg-black border border-zinc-800 rounded-2xl flex justify-between items-center hover:border-yellow-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                        <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{debt.amount_owed} MIST</p>
                      <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">{debt.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSettle(debt.id)}
                    className="bg-zinc-800 hover:bg-green-600 text-zinc-400 hover:text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all"
                  >
                    Settle
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          /* REAL BLOCKCHAIN RENDER (Your original logic) */
          error ? <p className="text-red-500">Error: {error.message}</p> :
          isPending ? <div className="flex items-center gap-2 text-zinc-500"><Loader2 className="animate-spin h-4 w-4" /> Scanning...</div> :
          !data || data.data.length === 0 ? <p className="text-zinc-500 italic">No assets found.</p> :
          data.data.map((obj) => (
            <div key={obj.data?.objectId} className="rounded-lg border border-zinc-800 bg-black p-3 mb-2">
              <p className="font-mono text-[10px] text-zinc-500">{obj.data?.objectId}</p>
              <p className="text-xs text-yellow-600 font-bold mt-1">Type: {obj.data?.type?.split("::").pop()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
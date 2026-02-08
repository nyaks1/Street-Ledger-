import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Package, Loader2, CheckCircle2, Clock, Zap, ArrowRight } from "lucide-react";
import { MOCK_MODE, MockDebt } from "./config";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const [mockDebts, setMockDebts] = useState<MockDebt[]>([]);
  // NEW: State for the Yellow Network "Favor Mode" session
  const [isFavorMode, setIsFavorMode] = useState(false);

  const loadMockData = () => {
    const data = JSON.parse(localStorage.getItem("mock_debts") || "[]");
    setMockDebts(data);
  };

  useEffect(() => {
    if (MOCK_MODE) {
      loadMockData();
      window.addEventListener("storage", loadMockData);
      return () => window.removeEventListener("storage", loadMockData);
    }
  }, []);

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
      <div className="p-10 bg-zinc-900/50 rounded-[2rem] border-2 border-dashed border-zinc-800 text-center text-zinc-600">
        <p className="italic font-medium text-lg mb-2">"Your word is your bond, but a ledger is better."</p>
        <p className="text-xs uppercase tracking-widest font-black">Connect Slush to unlock the street</p>
      </div>
    );
  }

  return (
    <Card className={`bg-black border-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden ${isFavorMode ? 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.1)]' : 'border-zinc-800 shadow-2xl'}`}>
      <CardHeader className={`border-b border-zinc-900 transition-colors ${isFavorMode ? 'bg-yellow-500/5' : 'bg-zinc-900/30'} pb-8`}>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className={`flex items-center gap-2 font-black uppercase tracking-tighter italic text-2xl transition-colors ${isFavorMode ? 'text-yellow-400' : 'text-white'}`}>
              <Package className="h-6 w-6" />
              Street Ledger
            </CardTitle>
            <CardDescription className="text-zinc-500 font-bold flex items-center gap-2 uppercase text-[10px] tracking-widest">
              {MOCK_MODE ? "Local Persistence Active" : "Sui Testnet Live"}
              {isFavorMode && <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-full animate-pulse">Favor Mode ON</span>}
            </CardDescription>
          </div>
          
          {/* THE YELLOW TOGGLE: This is your prize-winning interaction */}
          <button 
            onClick={() => setIsFavorMode(!isFavorMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase transition-all ${isFavorMode ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            <Zap size={14} className={isFavorMode ? 'fill-current' : ''} />
            {isFavorMode ? 'Close Yellow Session' : 'Enter Favor Mode'}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-8">
        {MOCK_MODE ? (
          <div className="space-y-4">
            {mockDebts.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="text-zinc-700" size={32} />
                </div>
                <p className="text-zinc-600 font-medium italic">The street is quiet... No active debts found.</p>
              </div>
            ) : (
              mockDebts.map((debt) => (
                <div key={debt.id} className={`p-6 bg-zinc-900/30 border rounded-3xl flex justify-between items-center transition-all group ${isFavorMode ? 'border-yellow-500/20 hover:border-yellow-500/50' : 'border-zinc-800/50 hover:border-zinc-500'}`}>
                  <div className="flex items-center gap-5">
                    {/* ICON LOGIC: Zap for Off-chain (Favor Mode), Check for On-chain (Sui) */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isFavorMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                        {isFavorMode ? <Zap size={24} className="fill-current" /> : <CheckCircle2 size={24} />}
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white tracking-tighter">
                        {debt.amount_owed} <span className="text-yellow-500 text-sm italic">USDC</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">{debt.description}</p>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <p className="text-[10px] font-mono text-zinc-600 truncate w-24">0x{debt.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSettle(debt.id)}
                    className="flex items-center gap-2 bg-white hover:bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                  >
                    Settle <ArrowRight size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          /* REAL SUI RENDER */
          error ? <p className="text-red-500 font-black">OUTAGE: {error.message}</p> :
          isPending ? <div className="flex flex-col items-center py-20 gap-4 text-zinc-500"><Loader2 className="animate-spin h-8 w-8 text-yellow-500" /><p className="font-black text-xs uppercase tracking-widest">Scanning Sui Mainframe...</p></div> :
          !data || data.data.length === 0 ? <p className="text-zinc-500 italic py-10 text-center">No objects found in your vault.</p> :
          data.data.map((obj) => (
            <div key={obj.data?.objectId} className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/20 mb-3 flex justify-between items-center group">
              <div>
                <p className="font-mono text-[9px] text-zinc-600 tracking-tighter">{obj.data?.objectId}</p>
                <p className="text-xs text-yellow-500 font-black mt-1 uppercase tracking-widest">Type: {obj.data?.type?.split("::").pop()}</p>
              </div>
              <CheckCircle2 className="text-green-500/20 group-hover:text-green-500 transition-colors" size={16} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
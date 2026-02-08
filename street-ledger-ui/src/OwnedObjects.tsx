import { useEffect, useState } from "react";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Package, Loader2, CheckCircle2, Clock, Zap, ArrowRight, Plus } from "lucide-react";
import { MOCK_MODE, MockDebt } from "./config";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const [mockDebts, setMockDebts] = useState<MockDebt[]>([]);
  const [isFavorMode, setIsFavorMode] = useState(false);
  const [favorDesc, setFavorDesc] = useState("");
  const [favorAmount, setFavorAmount] = useState("");

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

  const handleLogFavor = () => {
    if (!favorDesc || !favorAmount) return;
    
    const newFavorItem = {
      id: Math.random().toString(36).substring(7),
      amount_owed: parseInt(favorAmount),
      description: favorDesc,
      debtor: account?.address || "0x_Street_User"
    } as any as MockDebt;

    const existing = JSON.parse(localStorage.getItem("mock_debts") || "[]");
    localStorage.setItem("mock_debts", JSON.stringify([...existing, newFavorItem]));
    
    window.dispatchEvent(new Event("storage"));
    
    setFavorDesc("");
    setFavorAmount("");
  };

  if (!account) {
    return (
      <div className="p-16 bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-800 text-center text-zinc-600">
        <Clock className="w-10 h-10 mx-auto mb-4 opacity-20" />
        <p className="italic font-medium text-xl mb-2 text-zinc-500">"Your word is your bond, but a ledger is better."</p>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: 900, color: '#2563eb' }}>Awaiting Connection</p>
      </div>
    );
  }

  return (
    <Card className={`bg-black border-2 transition-all duration-500 rounded-[3rem] overflow-hidden ${isFavorMode ? 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.15)]' : 'border-zinc-800 shadow-2xl'}`}>
      <CardHeader className={`border-b border-zinc-900 transition-colors ${isFavorMode ? 'bg-yellow-500/5' : 'bg-zinc-900/30'} pb-10`}>
        <div className="flex flex-col items-center gap-4 w-full text-center">
          <div className="flex font-black text-2xl">
             <span style={{ backgroundColor: '#eab308', color: 'black', padding: '4px 16px', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' }}>S</span>
             <span style={{ backgroundColor: '#2563eb', color: 'white', padding: '4px 16px', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }}>L</span>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-3xl font-black uppercase tracking-tighter italic flex items-center justify-center gap-3">
              <Package className="h-7 w-7 text-yellow-500" />
              <span style={{ color: '#eab308' }}>Street</span> <span style={{ color: '#2563eb' }}>Ledger</span>
            </CardTitle>
            <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em]">
              {MOCK_MODE ? "Persistence Engine Active" : "Sui Network Verified"}
            </CardDescription>
          </div>
          
          {/* THE INLINE-STYLED BUTTON YOU REQUESTED */}
          <button 
            onClick={() => setIsFavorMode(!isFavorMode)}
            style={{
              marginTop: '24px',
              padding: '16px 40px',
              borderRadius: '16px',
              fontWeight: 900,
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              backgroundColor: isFavorMode ? '#eab308' : '#27272a',
              color: isFavorMode ? 'black' : '#a1a1aa',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <Zap size={14} style={{ fill: isFavorMode ? 'currentColor' : 'none', marginRight: '8px' }} />
            {isFavorMode ? 'Close Yellow Session' : 'Enter Favor Mode'}
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-10">
        {isFavorMode && (
          <div className="mb-10 p-8 bg-yellow-500/5 border-2 border-yellow-500/20 rounded-[2.5rem]">
            <h3 style={{ color: '#eab308', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} style={{ fill: 'currentColor' }} /> Instant Off-Chain Favor
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={favorDesc}
                  onChange={(e) => setFavorDesc(e.target.value)}
                  placeholder="The favor (e.g., Coffee, Lunch)" 
                  style={{ flex: 1, backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '16px 24px', fontSize: '14px', color: 'white' }}
                />
                <input 
                  type="number" 
                  value={favorAmount}
                  onChange={(e) => setFavorAmount(e.target.value)}
                  placeholder="USDC" 
                  style={{ width: '112px', backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '16px 24px', fontSize: '14px', color: 'white' }}
                />
              </div>
              <button 
                onClick={handleLogFavor}
                style={{ width: '100%', backgroundColor: '#eab308', color: 'black', fontWeight: 900, padding: '16px 0', borderRadius: '16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={18} style={{ marginRight: '8px' }} /> Log Instant Transaction
              </button>
            </div>
          </div>
        )}

        <div className="space-y-5">
          {MOCK_MODE ? (
            mockDebts.length === 0 ? (
              <div className="py-24 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
                <p className="text-zinc-700 font-medium italic">The street is quiet... No active favors.</p>
              </div>
            ) : (
              mockDebts.map((debt) => (
                <div key={debt.id} style={{ padding: '32px', backgroundColor: 'rgba(39, 39, 42, 0.2)', border: isFavorMode ? '1px solid rgba(234, 179, 8, 0.2)' : '1px solid #27272a', borderRadius: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="flex items-center gap-6">
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isFavorMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(37, 99, 235, 0.1)', color: isFavorMode ? '#eab308' : '#2563eb' }}>
                        {isFavorMode ? <Zap size={28} style={{ fill: 'currentColor' }} /> : <CheckCircle2 size={28} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '30px', fontWeight: 900, color: 'white', letterSpacing: '-0.05em' }}>
                        {debt.amount_owed} <span style={{ color: '#2563eb', fontSize: '16px', fontStyle: 'italic' }}>USDC</span>
                      </p>
                      <p style={{ color: '#71717a', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{debt.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSettle(debt.id)}
                    style={{ backgroundColor: 'white', color: 'black', padding: '16px 32px', borderRadius: '16px', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
                  >
                    Settle <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                  </button>
                </div>
              ))
            )
          ) : (
             /* REAL SUI RENDER */
             error ? <p style={{ color: '#ef4444', fontWeight: 900 }}>Outage: {error.message}</p> :
             isPending ? <Loader2 className="animate-spin" /> : 
             data?.data.map((obj) => (
                <div key={obj.data?.objectId} style={{ padding: '16px', border: '1px solid #27272a', borderRadius: '16px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>Verified Asset</span>
                   <CheckCircle2 size={16} style={{ color: '#2563eb' }} />
                </div>
             ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
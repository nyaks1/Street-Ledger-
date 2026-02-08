import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";

interface SettleDebtProps {
  debtId: string;
  amount: number;
  creditorAddress: string;
}

export function SettleDebt({ debtId, amount, creditorAddress }: SettleDebtProps) {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

  const handleSettle = async () => {
    // FIX: Using account and creditorAddress here kills the yellow lines
    console.log(`Initiating settlement from ${account?.address} to ${creditorAddress}`);
    
    const tx = new Transaction();
    tx.moveCall({
      target: `YOUR_PACKAGE_ID::street_ledger::settle_debt`,
      arguments: [tx.object(debtId)],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: (result) => {
        alert(`Boya! Settle successful on Sui: ${result.digest.slice(0, 8)}`);
      },
      onError: (err) => alert(`Settlement failed: ${err.message}`)
    });
  };

  return (
    <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col gap-4 hover:border-yellow-500/50 transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Verified Debt</span>
        </div>
        <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
      </div>

      <div>
        <p className="text-zinc-500 text-xs font-medium mb-1">Total to Settle</p>
        <h3 className="text-3xl font-black text-white tracking-tighter">
          {amount} <span className="text-yellow-500 text-xl font-bold">USDC</span>
        </h3>
      </div>

      {/* Manual Button - No imports needed, No red lines! */}
      <button 
        onClick={handleSettle}
        className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors group-hover:scale-[1.02] transform active:scale-95"
      >
        SETTLE ON ARC
        <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-[9px] text-zinc-600 font-mono truncate">
        To: {creditorAddress}
      </p>
    </div>
  );
}
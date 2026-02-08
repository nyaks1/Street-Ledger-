import { useState } from "react";
import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { STREET_LEDGER_PACKAGE_ID } from "../dApp-kit"; 
import { PlusCircle, Loader2, Zap, ShieldCheck } from "lucide-react";
import { MOCK_MODE } from "../config";
import { startStreetSession } from "../lib/yellow-service";

export function CreateDebtForm() {
    const [amount, setAmount] = useState("");
    const [debtor, setDebtor] = useState("");
    const [description, setDescription] = useState("");
    const [isInstantMode, setIsInstantMode] = useState(false); 
    
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

    const handleCreateDebt = async () => {
        if (!account) {
            alert("Connect your wallet first, Nyakallo!");
            return;
        }

        // --- YELLOW NETWORK LOGIC (Instant Off-Chain) ---
        if (isInstantMode) {
            await startStreetSession(account, account.address, debtor);
            alert("Boya! Yellow State Channel is Open. Favor logged off-chain.");
            return;
        }

        // --- MOCK MODE LOGIC ---
        if (MOCK_MODE) {
            const newDebt = {
                id: Math.random().toString(16).slice(2),
                amount_owed: Number(amount),
                amount_paid: 0,
                creditor: account?.address || "0xNyaks_Me", 
                debtor: debtor,
                description: description,
                is_confirmed: false,
                timestamp_created: Date.now(),
            };
            const existing = JSON.parse(localStorage.getItem("mock_debts") || "[]");
            localStorage.setItem("mock_debts", JSON.stringify([newDebt, ...existing]));
            window.dispatchEvent(new Event("storage"));
            alert("Success: Mock Debt Created.");
            return;
        }

        // --- SUI + ARC SPONSORED LOGIC ---
        const tx = new Transaction();
        tx.moveCall({
            target: `${STREET_LEDGER_PACKAGE_ID}::street_ledger::request_debt`,
            arguments: [
                tx.pure.u64(amount),
                tx.pure.address(debtor),
                tx.pure.string(description),
                tx.object('0x6'), 
            ],
        });

        signAndExecute({ transaction: tx }, {
            onSuccess: async (result) => {
                // Using suiClient here kills the orange warning!
                const txData = await suiClient.getTransactionBlock({
                    digest: result.digest,
                    options: { showEffects: true }
                });
                console.log("Boya! Transaction verified on-chain:", txData);
                
                alert("Debt request live on Sui. Gas sponsored by Street Ledger!");
                setAmount(""); setDebtor(""); setDescription("");
            },
            onError: (err) => alert("Blockchain says no: " + err.message)
        });
    }; // <--- THIS WAS THE MISSING PIECE!

    return (
        <div className="p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
            {/* Branding Flare */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-20 h-20 text-yellow-500 fill-current" />
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black flex items-center gap-2 text-white uppercase tracking-tighter">
                    <PlusCircle className="text-yellow-500" /> New Request
                </h2>
                
                <button 
                    onClick={() => setIsInstantMode(!isInstantMode)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        isInstantMode ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "bg-zinc-800 text-zinc-500"
                    }`}
                >
                    <Zap className="w-3 h-3" />
                    {isInstantMode ? "INSTANT MODE ON" : "INSTANT MODE OFF"}
                </button>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="group">
                    <label className="text-[10px] text-zinc-500 uppercase font-black ml-2 mb-1 block">Amount (MIST)</label>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-yellow-500 outline-none transition-all text-white font-mono text-xl"
                    />
                </div>

                <div className="group">
                    <label className="text-[10px] text-zinc-500 uppercase font-black ml-2 mb-1 block">Debtor Wallet</label>
                    <input 
                        type="text" 
                        placeholder="0x..." 
                        value={debtor} 
                        onChange={(e) => setDebtor(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-yellow-500 outline-none transition-all text-white font-mono text-xs"
                    />
                </div>

                <div className="group">
                    <label className="text-[10px] text-zinc-500 uppercase font-black ml-2 mb-1 block">Description</label>
                    <input 
                        type="text" 
                        placeholder="e.g. For the Kota" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black border border-zinc-800 p-4 rounded-2xl focus:border-yellow-500 outline-none transition-all text-white"
                    />
                </div>

                <button 
                    onClick={handleCreateDebt}
                    disabled={isPending}
                    className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl hover:bg-yellow-400 disabled:opacity-50 transition-all uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : (
                        <>
                            <ShieldCheck className="w-5 h-5" />
                            {isInstantMode ? "Finalize Instant Favor" : "Send Sponsored Request"}
                        </>
                    )}
                </button>

                <div className="flex justify-between items-center px-2">
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                        Network: <span className="text-zinc-400">Sui Testnet</span>
                    </p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                        Fees: <span className="text-green-500">Sponsored (Free)</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { STREET_LEDGER_PACKAGE_ID } from "../dApp-kit"; 
import { PlusCircle, Loader2 } from "lucide-react";
import { MOCK_MODE } from "../config";

export function CreateDebtForm() {
    // 1. Hooks and State MUST be inside the function
    const [amount, setAmount] = useState("");
    const [debtor, setDebtor] = useState("");
    const [description, setDescription] = useState("");
    const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

    // 2. The function logic
    const handleCreateDebt = () => {
        // --- MOCK MODE LOGIC ---
        if (MOCK_MODE) {
            const newDebt = {
                id: Math.random().toString(16).slice(2),
                amount_owed: Number(amount),
                amount_paid: 0,
                creditor: "0xNyaks_Me", 
                debtor: debtor || "0xFriend_Address",
                description: description,
                is_confirmed: false,
                timestamp_created: Date.now(),
            };

            const existing = JSON.parse(localStorage.getItem("mock_debts") || "[]");
            localStorage.setItem("mock_debts", JSON.stringify([newDebt, ...existing]));

            window.dispatchEvent(new Event("storage"));

            alert("Boya! Mock Debt Created Successfully.");
            setAmount(""); setDebtor(""); setDescription("");
            return;
        }

        // --- REAL BLOCKCHAIN LOGIC ---
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
            onSuccess: () => {
                alert("Boya! Debt request sent to Sui Testnet.");
                setAmount(""); setDebtor(""); setDescription("");
            },
            onError: (err) => alert("Failed: " + err.message)
        });
    };

    // 3. The UI
    return (
        <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-yellow-500 uppercase">
                <PlusCircle /> New Debt Request
            </h2>
            <div className="space-y-4">
                <input 
                    type="number" 
                    placeholder="Amount (MIST)" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-white"
                />
                <input 
                    type="text" 
                    placeholder="Debtor Wallet Address (0x...)" 
                    value={debtor} 
                    onChange={(e) => setDebtor(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-white"
                />
                <input 
                    type="text" 
                    placeholder="What's this for? (e.g. Lunch)" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-4 rounded-xl focus:border-yellow-500 outline-none transition-all text-white"
                />
                <button 
                    onClick={handleCreateDebt}
                    disabled={isPending}
                    className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all uppercase tracking-tighter"
                >
                    {isPending ? <Loader2 className="animate-spin mx-auto" /> : "Send Request"}
                </button>
                {MOCK_MODE && (
                    <p className="text-[10px] text-center text-zinc-600 uppercase tracking-widest">
                        Running in Mock Mode (Local Storage)
                    </p>
                )}
            </div>
        </div>
    );
}
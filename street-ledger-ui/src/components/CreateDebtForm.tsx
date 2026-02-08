import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../dApp-kit"; 
import { useState } from "react";

export function CreateDebtForm() {
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const streetLedgerPackageId = useNetworkVariable("streetLedgerPackageId");
    
    const [amount, setAmount] = useState("");
    const [debtor, setDebtor] = useState("");
    const [desc, setDesc] = useState("");

    const createDebt = () => {
        if (!amount || !debtor || !desc) return alert("Fill in the blanks, Nyaks!");

        const tx = new Transaction();

        tx.moveCall({
            target: `${streetLedgerPackageId}::street_ledger::request_debt`,
            arguments: [
                tx.pure.u64(amount), 
                tx.pure.address(debtor),
                tx.pure.string(desc),
                tx.object("0x6"), // Global Clock
            ],
        });

        signAndExecute(
            { transaction: tx },
            {
                onSuccess: (result) => {
                    console.log("Debt requested!", result);
                    alert("Success! The debt is now on the Sui blockchain.");
                    setAmount(""); setDebtor(""); setDesc("");
                },
                onError: (err) => {
                    console.error("Failed:", err);
                    alert("Transaction failed! Check your wallet or testnet balance.");
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-4 p-8 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
            <h2 className="text-2xl font-black text-yellow-500 uppercase tracking-tighter">Request Debt</h2>
            <p className="text-zinc-500 text-sm -mt-2">Record a new debt for someone to accept.</p>
            
            <div className="space-y-4 mt-2">
                <input 
                    placeholder="Debtor Address (0x...)" 
                    value={debtor}
                    className="w-full p-4 bg-black rounded-xl border border-zinc-700 outline-none focus:border-yellow-500 text-white transition-all"
                    onChange={(e) => setDebtor(e.target.value)}
                />
                <input 
                    placeholder="Amount (in MIST)" 
                    type="number"
                    value={amount}
                    className="w-full p-4 bg-black rounded-xl border border-zinc-700 outline-none focus:border-yellow-500 text-white transition-all"
                    onChange={(e) => setAmount(e.target.value)}
                />
                <input 
                    placeholder="What is this for? (e.g. Kota & Coke)" 
                    value={desc}
                    className="w-full p-4 bg-black rounded-xl border border-zinc-700 outline-none focus:border-yellow-500 text-white transition-all"
                    onChange={(e) => setDesc(e.target.value)}
                />
            </div>
            
            <button 
                onClick={createDebt}
                className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-xl transform active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
            >
                SEND DEBT REQUEST
            </button>
        </div>
    );
}
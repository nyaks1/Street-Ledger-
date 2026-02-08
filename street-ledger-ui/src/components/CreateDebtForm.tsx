import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { STREET_LEDGER_PACKAGE_ID } from "../dApp-kit";
import { useState } from "react";

export function CreateDebtForm() {
	const { mutate: signAndExecute } = useSignAndExecuteTransaction();
	const [amount, setAmount] = useState("");
	const [debtor, setDebtor] = useState("");
	const [desc, setDesc] = useState("");

	const createDebt = () => {
		const tx = new Transaction();
		tx.moveCall({
			target: `${STREET_LEDGER_PACKAGE_ID}::street_ledger::request_debt`,
			arguments: [
				tx.pure.u64(amount),
				tx.pure.address(debtor),
				tx.pure.string(desc),
				tx.object("0x6"),
			],
		});

		signAndExecute({ transaction: tx }, {
			onSuccess: () => alert("Debt Requested!"),
			onError: (err) => console.error(err),
		});
	};

	return (
		<div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-white">
			<h2 className="text-xl font-bold text-yellow-500 mb-4">Request Debt</h2>
			<div className="space-y-4">
				<input 
					className="w-full p-2 bg-black border border-zinc-700 rounded" 
					placeholder="Debtor Address" value={debtor} onChange={e => setDebtor(e.target.value)} 
				/>
				<input 
					className="w-full p-2 bg-black border border-zinc-700 rounded" 
					placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} 
				/>
				<input 
					className="w-full p-2 bg-black border border-zinc-700 rounded" 
					placeholder="Reason" value={desc} onChange={e => setDesc(e.target.value)} 
				/>
				<button onClick={createDebt} className="w-full bg-yellow-500 text-black font-bold py-2 rounded">
					SEND REQUEST
				</button>
			</div>
		</div>
	);
}
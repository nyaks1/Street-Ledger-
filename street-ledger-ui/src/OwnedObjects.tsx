import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Package, Loader2 } from "lucide-react";

export function OwnedObjects() {
  const account = useCurrentAccount();

  // This is the Standard way to fetch objects. It handles the 'loading' and 'error' states for you!
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
    },
    {
      enabled: !!account,
    }
  );

  if (!account) {
    return null;
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-500">
          <Package className="h-5 w-5" />
          My Assets
        </CardTitle>
        <CardDescription className="text-zinc-400">Objects owned by your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">
            Error: {error.message}
          </p>
        ) : isPending ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning blockchain...
          </div>
        ) : !data || data.data.length === 0 ? (
          <p className="text-zinc-500 italic">No objects found on Testnet</p>
        ) : (
          <div className="space-y-2">
            {data.data.map((obj) => (
              <div
                key={obj.data?.objectId}
                className="rounded-lg border border-zinc-800 bg-black p-3"
              >
                <p className="font-mono text-[10px] text-zinc-400 break-all">
                  ID: {obj.data?.objectId}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Type: {obj.data?.type?.split("::").pop()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
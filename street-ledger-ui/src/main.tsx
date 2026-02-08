import React from "react";
import ReactDOM from "react-dom/client";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";

// Essential CSS for the wallet button
import "@mysten/dapp-kit/dist/index.css";

// We use 'as any' to tell TypeScript: "Trust me, I'm a developer."
// This fixes the red lines under networkConfig and url.
const { networkConfig } = createNetworkConfig({
    testnet: { 
        url: "https://sui-testnet-rpc.publicnode.com" 
    },
} as any);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                <WalletProvider autoConnect>
                    <App />
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
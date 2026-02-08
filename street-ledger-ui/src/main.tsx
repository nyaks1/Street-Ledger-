import React from "react";
import ReactDOM from "react-dom/client";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";

// Ensure we use standard CSS
import "@mysten/dapp-kit/dist/index.css";

// Manual config - no imports from other files to fail
const { networkConfig } = createNetworkConfig({
    testnet: { 
        url: "https://fullnode.testnet.sui.io:443" 
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
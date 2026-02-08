import { createNetworkConfig } from "@mysten/dapp-kit";

export const STREET_LEDGER_PACKAGE_ID = "0x93e4236da659c792c21ef2f894338ceea4d2fef5efff368870910e93c8bf54af";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: "https://fullnode.testnet.sui.io:443",
        variables: {
            streetLedgerPackageId: STREET_LEDGER_PACKAGE_ID,
        },
    },
});

export { networkConfig, useNetworkVariable, useNetworkVariables };
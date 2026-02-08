// src/lib/yellow-service.ts
import { createAppSessionMessage } from '@erc7824/nitrolite';

/**
 * startStreetSession
 * Opens a Yellow Nitrolite state channel between the user and a friend.
 * This allows for 0-gas, instant "Street Favors" logging.
 */
export const startStreetSession = async (signer: any, myAddr: string, friendAddr: string) => {
    console.log("Opening Yellow Nitrolite Session...");
    
    // Safety check for the HP laptop console
    if (!myAddr || !friendAddr) {
        console.error("Missing participant addresses!");
        return null;
    }

    try {

        const session = await (createAppSessionMessage as any)(signer, [
            {
                definition: { 
                    protocol: 'street-ledger-v1', 
                    participants: [myAddr, friendAddr] 
                },
                allocations: [
                    { 
                        participant: myAddr, 
                        asset: 'usdc', 
                        amount: '1000000' // 1.00 USDC
                    }
                ]
            }
        ] as any);

        console.log("Yellow Session Created:", session);
        return session;
    } catch (error) {
        console.error("Yellow Session Failed:", error);
        // We throw so the UI can show a 'Boya, something went wrong' alert
        throw error;
    }
};
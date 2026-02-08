// src/config.ts
export const MOCK_MODE = true;

export interface MockDebt {
    id: string;
    amount_owed: number;
    amount_paid: number;
    creditor: string;
    debtor: string;
    description: string;
    is_confirmed: boolean;
    timestamp_created: number;
}
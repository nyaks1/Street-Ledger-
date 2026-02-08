/// Module: street_ledger
/// A decentralized P2P ledger for tracking informal debts with confirmation, 
/// partial payment support, debt aging, and third-party vouching.
module street_ledger::street_ledger {
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::option;

    // --- Error Codes ---

    /// Caller is not authorized to perform this action.
    const ENotAuthorized: u64 = 0;
    /// The payment amount exceeds the remaining balance.
    const EAmountTooHigh: u64 = 1;
    /// Cannot delete a debt that hasn't been fully paid.
    const ENotFullyPaid: u64 = 2;
    /// This debt has already been vouched for by a guarantor.
    const EAlreadyVouched: u64 = 3;

    // --- Events ---

    /// Emitted when a new debt request is created.
    public struct DebtCreated has copy, drop {
        debt_id: ID,
        creditor: address,
        debtor: address,
        amount: u64,
    }

    /// Emitted when a payment is recorded against a debt.
    public struct DebtPaid has copy, drop {
        debt_id: ID,
        amount_paid: u64,
        remaining: u64,
    }

    // --- Struct Definition ---

    /// Represents a debt object on the Sui blockchain.
    /// Owned by the debtor to ensure they have control over their obligations.
    public struct Debt has key, store {
        id: UID,
        /// Total amount originally owed.
        amount_owed: u64,
        /// Amount already paid back.
        amount_paid: u64,
        /// Address of the person who lent the money.
        creditor: address,
        /// Address of the person who borrowed the money (Object Owner).
        debtor: address,
        /// Description of the debt (e.g., "Lunch money").
        description: vector<u8>,
        /// Status indicating if the debtor has acknowledged the debt.
        is_confirmed: bool,
        /// Timestamp (in ms) of when the debt was requested.
        timestamp_created: u64,
        /// Optional guarantor address who vouches for the debtor's reliability.
        guarantor: Option<address>,
    }

    // --- Core Functions ---

    /// Creates a new debt request and transfers it to the debtor for confirmation.
    /// @param amount: The total value of the debt.
    /// @param debtor: The address of the person receiving the debt object.
    /// @param description: A string/memo describing the debt.
    /// @param clock: The Sui system clock for timestamping.
    public fun request_debt(
        amount: u64, 
        debtor: address, 
        description: vector<u8>, 
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let debt = Debt {
            id: object::new(ctx),
            amount_owed: amount,
            amount_paid: 0,
            creditor: sender,
            debtor,
            description,
            is_confirmed: false,
            timestamp_created: clock::timestamp_ms(clock),
            guarantor: option::none(),
        };

        event::emit(DebtCreated {
            debt_id: object::id(&debt),
            creditor: sender,
            debtor,
            amount,
        });

        transfer::transfer(debt, debtor);
    }

    /// Allows a third party (neither creditor nor debtor) to vouch for the debt.
    /// @param debt: The mutable reference to the Debt object.
    public fun vouch_for_debt(debt: &mut Debt, ctx: &TxContext) {
        let sender = tx_context::sender(ctx);
        // Ensure the guarantor is not a party already involved
        assert!(sender != debt.debtor && sender != debt.creditor, ENotAuthorized);
        assert!(option::is_none(&debt.guarantor), EAlreadyVouched);

        option::fill(&mut debt.guarantor, sender);
    }

    /// Allows the debtor to confirm the debt request, making it official on the ledger.
    public fun accept_debt(debt: &mut Debt, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == debt.debtor, ENotAuthorized);
        debt.is_confirmed = true;
    }

    /// Records a payment towards the debt. Usually called by the creditor.
    public fun record_payment(debt: &mut Debt, payment_amount: u64, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == debt.creditor, ENotAuthorized);
        assert!(payment_amount <= (debt.amount_owed - debt.amount_paid), EAmountTooHigh);

        debt.amount_paid = debt.amount_paid + payment_amount;

        event::emit(DebtPaid {
            debt_id: object::id(debt),
            amount_paid: payment_amount,
            remaining: debt.amount_owed - debt.amount_paid,
        });
    }

    /// Allows the current creditor to transfer their right to be paid to a new address.
    public fun transfer_debt_right(debt: &mut Debt, new_creditor: address, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == debt.creditor, ENotAuthorized);
        debt.creditor = new_creditor;
    }

    /// Deletes the debt object once it's fully paid to clean up storage.
    public fun delete_debt(debt: Debt, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == debt.debtor, ENotAuthorized);
        assert!(debt.amount_paid == debt.amount_owed, ENotFullyPaid);

        let Debt { id, .. } = debt;
        object::delete(id);
    }

    // --- Getter Functions ---

    /// Returns the age of the debt in milliseconds.
    public fun get_debt_age(debt: &Debt, clock: &Clock): u64 {
        clock::timestamp_ms(clock) - debt.timestamp_created
    }

    /// Returns the guarantor address if one exists.
    public fun guarantor(debt: &Debt): Option<address> {
        debt.guarantor
    }

    public fun is_confirmed(debt: &Debt): bool { debt.is_confirmed }
    public fun amount_unpaid(debt: &Debt): u64 { debt.amount_owed - debt.amount_paid }
    public fun amount_paid(debt: &Debt): u64 { debt.amount_paid }
    public fun current_creditor(debt: &Debt): address { debt.creditor }
}
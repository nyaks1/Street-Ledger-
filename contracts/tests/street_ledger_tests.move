#[test_only]
/// Test module for street_ledger.
/// Covers core flows, object lifecycle, rights transfer, vouching, and debt aging.
module street_ledger::street_ledger_tests {
    use sui::test_scenario;
    use sui::clock;
    use std::option;
    use street_ledger::street_ledger::{Self, Debt};

    #[test]
    /// Tests the initial handshake: Creditor creates a request and Debtor confirms it.
    fun test_request_and_accept_flow() {
        let creditor = @0xA;
        let debtor = @0xB;
        
        let mut scenario = test_scenario::begin(creditor);
        let clock_obj = clock::create_for_testing(test_scenario::ctx(&mut scenario));

        // 1. Creditor initiates the debt request
        street_ledger::request_debt(1000, debtor, b"Rent", &clock_obj, test_scenario::ctx(&mut scenario));
        
        // 2. Debtor accepts the debt to finalize the entry
        test_scenario::next_tx(&mut scenario, debtor);
        {
            let mut debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            
            assert!(street_ledger::is_confirmed(&debt) == false, 0);
            street_ledger::accept_debt(&mut debt, test_scenario::ctx(&mut scenario));
            assert!(street_ledger::is_confirmed(&debt) == true, 1);
            
            test_scenario::return_to_address(debtor, debt);
        };
        
        clock::destroy_for_testing(clock_obj);
        test_scenario::end(scenario);
    }

    #[test]
    /// Verifies that partial payments correctly update the balance.
    fun test_partial_payment_math() {
        let creditor = @0xA;
        let debtor = @0xB;
        let mut scenario = test_scenario::begin(creditor);
        let clock_obj = clock::create_for_testing(test_scenario::ctx(&mut scenario));

        street_ledger::request_debt(1000, debtor, b"Groceries", &clock_obj, test_scenario::ctx(&mut scenario));
        
        test_scenario::next_tx(&mut scenario, creditor);
        {
            let mut debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            street_ledger::record_payment(&mut debt, 400, test_scenario::ctx(&mut scenario));
            
            assert!(street_ledger::amount_paid(&debt) == 400, 2);
            assert!(street_ledger::amount_unpaid(&debt) == 600, 3);
            
            test_scenario::return_to_address(debtor, debt);
        };
        
        clock::destroy_for_testing(clock_obj);
        test_scenario::end(scenario);
    }

    #[test]
    /// Ensures fully settled debts can be deleted by the debtor.
    fun test_delete_paid_debt() {
        let creditor = @0xA;
        let debtor = @0xB;
        let mut scenario = test_scenario::begin(creditor);
        let clock_obj = clock::create_for_testing(test_scenario::ctx(&mut scenario));

        street_ledger::request_debt(100, debtor, b"Kota", &clock_obj, test_scenario::ctx(&mut scenario));
        
        test_scenario::next_tx(&mut scenario, creditor);
        {
            let mut debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            street_ledger::record_payment(&mut debt, 100, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address(debtor, debt);
        };

        test_scenario::next_tx(&mut scenario, debtor);
        {
            let debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            street_ledger::delete_debt(debt, test_scenario::ctx(&mut scenario));
        };

        test_scenario::next_tx(&mut scenario, debtor);
        {
            assert!(!test_scenario::has_most_recent_for_address<Debt>(debtor), 4);
        };
        
        clock::destroy_for_testing(clock_obj);
        test_scenario::end(scenario);
    }

    #[test]
    /// Tests the transfer of creditor rights.
    fun test_transfer_debt_right() {
        let creditor = @0xA;
        let debtor = @0xB;
        let third_party = @0xC;
        let mut scenario = test_scenario::begin(creditor);
        let clock_obj = clock::create_for_testing(test_scenario::ctx(&mut scenario));

        street_ledger::request_debt(1000, debtor, b"Rent", &clock_obj, test_scenario::ctx(&mut scenario));
        
        test_scenario::next_tx(&mut scenario, creditor);
        {
            let mut debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            street_ledger::transfer_debt_right(&mut debt, third_party, test_scenario::ctx(&mut scenario));
            assert!(street_ledger::current_creditor(&debt) == third_party, 5);
            test_scenario::return_to_address(debtor, debt);
        };

        test_scenario::next_tx(&mut scenario, third_party);
        {
            let mut debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            street_ledger::record_payment(&mut debt, 500, test_scenario::ctx(&mut scenario));
            assert!(street_ledger::amount_paid(&debt) == 500, 6);
            test_scenario::return_to_address(debtor, debt);
        };
        
        clock::destroy_for_testing(clock_obj);
        test_scenario::end(scenario);
    }

    #[test]
    /// Tests the vouching system and verifies debt aging tracks time correctly.
    fun test_vouch_and_aging() {
        let creditor = @0xA;
        let debtor = @0xB;
        let guarantor = @0xC;
        
        let mut scenario = test_scenario::begin(creditor);
        let mut clock_obj = clock::create_for_testing(test_scenario::ctx(&mut scenario));

        street_ledger::request_debt(1000, debtor, b"Street Ledger", &clock_obj, test_scenario::ctx(&mut scenario));
        
        // Simulate 1 hour passing (3,600,000 ms)
        clock::increment_for_testing(&mut clock_obj, 3600000);

        test_scenario::next_tx(&mut scenario, guarantor);
        {
            let mut debt = test_scenario::take_from_address<Debt>(&scenario, debtor);
            street_ledger::vouch_for_debt(&mut debt, test_scenario::ctx(&mut scenario));
            
            assert!(street_ledger::get_debt_age(&debt, &clock_obj) == 3600000, 7);
            assert!(option::is_some(&street_ledger::guarantor(&debt)), 8);
            
            test_scenario::return_to_address(debtor, debt);
        };

        clock::destroy_for_testing(clock_obj);
        test_scenario::end(scenario);
    }
}
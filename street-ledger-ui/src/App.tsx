import { useEffect, useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { CreateDebtForm } from "./components/CreateDebtForm";
import { OwnedObjects } from "./OwnedObjects"; 
import { MOCK_MODE, MockDebt } from "./config"; 

function App() {
  const account = useCurrentAccount();
  const [debts, setDebts] = useState<MockDebt[]>([]);

  const updateStats = () => {
    if (MOCK_MODE) {
      const data = JSON.parse(localStorage.getItem("mock_debts") || "[]");
      setDebts(data);
    }
  };

  useEffect(() => {
    updateStats();
    window.addEventListener("storage", updateStats);
    return () => window.removeEventListener("storage", updateStats);
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: 'white', position: 'relative' }}>
      {/* 1. THE GRADIENT BLUR */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '500px', backgroundColor: 'rgba(234, 179, 8, 0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />

      {/* --- NAVBAR (Compact & Fixed Nesting) --- */}
      <nav style={{ 
        borderBottom: '1px solid #27272a', 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        backdropFilter: 'blur(20px)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        padding: '12px 0' 
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'relative'
        }}>
          
          {/* TOP LEFT: SL Logo + Wallet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', fontWeight: 900, fontSize: '18px' }}>
              <span style={{ backgroundColor: '#eab308', color: 'black', padding: '4px 10px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>S</span>
              <span style={{ backgroundColor: '#2563eb', color: 'white', padding: '4px 10px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>L</span>
            </div>
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
              <ConnectButton />
            </div>
          </div>

          {/* CENTER TOP: Street Ledger Title */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em', margin: 0 }}>
              <span style={{ color: '#eab308' }}>Street</span> <span style={{ color: '#2563eb' }}>Ledger</span>
            </h1>
          </div>

          {/* TOP RIGHT: High Visibility System Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            border: '1px solid rgba(34, 197, 94, 0.4)', 
            boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)' 
          }}>
            <div style={{ 
              width: '10px', 
              height: '10px', 
              backgroundColor: '#22c55e', 
              borderRadius: '50%', 
              boxShadow: '0 0 10px #22c55e, 0 0 20px #22c55e' 
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1' }}>Sui Testnet</span>
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', marginTop: '2px' }}>Live Connection</span>
            </div>
          </div>
        </div> {/* Closed the inner flex div */}
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', zIndex: 10 }}>
        {!account ? (
          <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: 'rgba(39, 39, 42, 0.2)', borderRadius: '64px', border: '2px dashed #27272a' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px', color: 'white', textTransform: 'uppercase', fontStyle: 'italic' }}>System Offline</h2>
            <p style={{ color: '#71717a' }}>Authorize the ledger to continue.</p>
          </div>
        ) : (
          <>
            {/* STATS DASHBOARD */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '64px' }}>
              <div style={{ padding: '32px', backgroundColor: 'rgba(39, 39, 42, 0.4)', borderRadius: '40px', border: '1px solid #27272a' }}>
                <p style={{ color: '#71717a', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Total Hustle</p>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#eab308', fontStyle: 'italic' }}>{debts.length} DEBTS</p>
              </div>
              <div style={{ padding: '32px', backgroundColor: 'rgba(39, 39, 42, 0.4)', borderRadius: '40px', border: '1px solid #27272a' }}>
                <p style={{ color: '#71717a', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Street Trust</p>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#2563eb', fontStyle: 'italic' }}>98% SCORE</p>
              </div>
              <div style={{ padding: '32px', backgroundColor: 'rgba(39, 39, 42, 0.4)', borderRadius: '40px', border: '1px solid #27272a' }}>
                <p style={{ color: '#71717a', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px' }}>Liquidity Hub</p>
                <p style={{ fontSize: '30px', fontWeight: 900, color: '#22c55e', fontStyle: 'italic' }}>ARC-USDC</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} className="lg:grid-cols-12">
              <div className="lg:col-span-5"><CreateDebtForm /></div>
              <div className="lg:col-span-7"><OwnedObjects /></div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
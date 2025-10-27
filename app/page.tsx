'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import Header from './components/Header';
import Footer from './components/Footer';
import MarketSelector from './components/MarketSelector';
import { Leg } from '@/lib/types';
import { useCreateMatchbox, useGetMatchboxesForOwner } from '@/lib/hooks/useMatchboxFactory';
import { useInitializeSequence } from '@/lib/hooks/useMatchbox';
import { legToRule, validateSequence } from '@/lib/utils';

export default function Home() {
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  
  const [legs, setLegs] = useState<Leg[]>([
    {
      id: '1',
      market: '',
      outcome: 'YES',
      amount: '',
      maxPrice: '',
      minPrice: '',
      isInitial: true,
    },
  ]);

  const [hasInitiatedDeploy, setHasInitiatedDeploy] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Contract hooks
  const { createMatchbox, hash: createHash, deployedAddress, isSuccess: createSuccess, error: createError } = useCreateMatchbox();
  const { matchboxes } = useGetMatchboxesForOwner(address);

  // Use the deployed address from the transaction receipt
  const deployedMatchbox = deployedAddress;

  const { initializeSequence, hash: initHash, isSuccess: initSuccess, error: initError } = useInitializeSequence(deployedMatchbox || undefined);

  // Derive deployment state from contract hooks
  const deploymentStep = 
    initSuccess ? 'complete' :
    (initHash && !initSuccess && !initError) ? 'initializing' :
    (createHash && !createSuccess && !createError) ? 'creating' :
    (createError || initError) ? 'error' :
    hasInitiatedDeploy ? 'creating' :
    'idle';

  const errorMessage = validationError || createError?.message || initError?.message || null;

  const addLeg = () => {
    setLegs([
      ...legs,
      {
        id: String(legs.length + 1),
        market: '',
        outcome: 'YES',
        amount: '',
        maxPrice: '',
        minPrice: '',
        isInitial: false,
      },
    ]);
  };

  const removeLeg = (id: string) => {
    if (legs.length > 1) {
      setLegs(legs.filter((leg) => leg.id !== id));
    }
  };

  const updateLeg = (id: string, field: keyof Leg, value: string | 'YES' | 'NO') => {
    setLegs(
      legs.map((leg) =>
        leg.id === id ? { ...leg, [field]: value } : leg
      )
    );
  };

  // Auto-initialize sequence when matchbox is deployed
  useEffect(() => {
    if (deployedMatchbox && !initHash) {
      const rules = legs.map(legToRule);
      initializeSequence(rules).catch((err) => {
        console.error('Failed to initialize sequence:', err);
      });
    }
  }, [deployedMatchbox, initHash, legs, initializeSequence]);

  const handleDeploy = async () => {
    setValidationError(null);
    
    // Validate the sequence
    const error = validateSequence(legs);
    if (error) {
      setValidationError(error);
      return;
    }

    setHasInitiatedDeploy(true);
    
    try {
      await createMatchbox();
    } catch (err) {
      console.error('Failed to deploy Matchbox:', err);
    }
  };

  const resetDeployment = () => {
    setHasInitiatedDeploy(false);
    setValidationError(null);
    window.location.reload(); // Simple reset by reloading the page
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">BUILD A MATCHBOX</h2>
          <p className="text-zinc-400 text-sm mb-2">
            Design your conditional sequence. Each leg executes only if the
            previous market resolves in your favor.
          </p>
          {matchboxes && matchboxes.length > 0 && (
            <p className="text-primary text-xs">
              You have {matchboxes.length} Matchbox{matchboxes.length > 1 ? 'es' : ''} deployed
            </p>
          )}
        </div>


        {/* Legs */}
        <div className="space-y-4">
          {legs.map((leg, index) => (
            <div
              key={leg.id}
              className="border border-zinc-800 rounded-lg p-6 bg-zinc-950"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold text-lg">
                    {leg.isInitial ? 'INITIAL' : `LEG ${index}`}
                  </span>
                  {!leg.isInitial && (
                    <span className="text-xs text-zinc-500">
                      → EXECUTES IF PREVIOUS LEG RESOLVES {legs[index - 1]?.outcome}
                    </span>
                  )}
                </div>
                {!leg.isInitial && (
                  <button
                    onClick={() => removeLeg(leg.id)}
                    className="text-zinc-500 hover:text-red-500 text-sm"
                  >
                    REMOVE
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-zinc-400 mb-1">
                    POLYMARKET URL
                  </label>
                  <MarketSelector
                    value={leg.market}
                    onChange={(conditionId) => updateLeg(leg.id, 'market', conditionId)}
                    placeholder="Paste Polymarket URL (e.g., https://polymarket.com/event/...)"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    OUTCOME
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateLeg(leg.id, 'outcome', 'YES')}
                      className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                        leg.outcome === 'YES'
                          ? 'bg-accent text-black'
                          : 'bg-zinc-900 hover:bg-zinc-800'
                      }`}
                    >
                      YES
                    </button>
                    <button
                      onClick={() => updateLeg(leg.id, 'outcome', 'NO')}
                      className={`flex-1 py-2 rounded text-sm font-medium transition-all ${
                        leg.outcome === 'NO'
                          ? 'bg-accent text-black'
                          : 'bg-zinc-900 hover:bg-zinc-800'
                      }`}
                    >
                      NO
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    AMOUNT (USDC)
                  </label>
                  <input
                    type="number"
                    value={leg.amount}
                    onChange={(e) => updateLeg(leg.id, 'amount', e.target.value)}
                    placeholder="100"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    MAX PRICE
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={leg.maxPrice}
                    onChange={(e) => updateLeg(leg.id, 'maxPrice', e.target.value)}
                    placeholder="0.50"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    MIN PRICE
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={leg.minPrice}
                    onChange={(e) => updateLeg(leg.id, 'minPrice', e.target.value)}
                    placeholder="0.10"
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Leg Button */}
        <button
          onClick={addLeg}
          className="w-full mt-4 py-3 border border-dashed border-zinc-700 rounded-lg text-zinc-400 hover:border-primary hover:text-primary transition-all text-sm font-medium"
        >
          + ADD CONDITIONAL LEG
        </button>

        {/* Deploy Section */}
        <div className="mt-12 border border-zinc-800 rounded-lg p-6 bg-zinc-950">
          <h3 className="font-bold mb-2">DEPLOY MATCHBOX</h3>
          <p className="text-xs text-zinc-400 mb-4">
            This will create your personal, non-custodial vault and initialize
            your sequence. Only you can withdraw funds.
          </p>

          {/* Status Messages */}
          {deploymentStep === 'creating' && (
            <div className="mb-4 p-3 bg-blue-950/30 border border-blue-800 rounded text-blue-400 text-sm">
              🔨 Creating your Matchbox vault... Please confirm the transaction.
            </div>
          )}

          {deploymentStep === 'initializing' && (
            <div className="mb-4 p-3 bg-blue-950/30 border border-blue-800 rounded text-blue-400 text-sm">
              ⚙️ Initializing sequence... Please confirm the transaction.
            </div>
          )}

          {deploymentStep === 'complete' && deployedMatchbox && (
            <div className="mb-4 p-3 bg-green-950/30 border border-green-800 rounded text-green-400 text-sm">
              ✅ Matchbox deployed successfully!
              <div className="mt-2 text-xs font-mono break-all">
                Address: {deployedMatchbox}
              </div>
              <button
                onClick={resetDeployment}
                className="mt-3 text-xs underline hover:no-underline"
              >
                Deploy another Matchbox
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-800 rounded text-red-400 text-sm">
              ❌ {errorMessage}
              <button
                onClick={resetDeployment}
                className="mt-2 text-xs underline hover:no-underline block"
              >
                Try again
              </button>
            </div>
          )}

          {/* Transaction Hashes */}
          {createHash && (
            <div className="mb-4 text-xs text-zinc-500">
              Create tx:{' '}
              <a
                href={`https://polygonscan.com/tx/${createHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-mono"
              >
                {createHash.slice(0, 10)}...{createHash.slice(-8)}
              </a>
            </div>
          )}

          {initHash && (
            <div className="mb-4 text-xs text-zinc-500">
              Initialize tx:{' '}
              <a
                href={`https://polygonscan.com/tx/${initHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-mono"
              >
                {initHash.slice(0, 10)}...{initHash.slice(-8)}
              </a>
            </div>
          )}

          <button
            onClick={handleDeploy}
            disabled={!authenticated || deploymentStep === 'creating' || deploymentStep === 'initializing' || deploymentStep === 'complete'}
            className={`w-full py-3 rounded font-bold transition-all ${
              authenticated && deploymentStep === 'idle' || deploymentStep === 'error'
                ? 'bg-primary hover:opacity-80 text-white'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {!authenticated
              ? 'LOGIN TO DEPLOY'
              : deploymentStep === 'creating'
              ? 'CREATING VAULT...'
              : deploymentStep === 'initializing'
              ? 'INITIALIZING...'
              : deploymentStep === 'complete'
              ? 'DEPLOYED ✓'
              : 'DEPLOY MATCHBOX'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

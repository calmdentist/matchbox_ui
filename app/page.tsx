'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Header from './components/Header';
import Footer from './components/Footer';

type Leg = {
  id: string;
  market: string;
  outcome: 'YES' | 'NO';
  amount: string;
  maxPrice: string;
  minPrice: string;
  isInitial: boolean;
};

export default function Home() {
  const { authenticated } = usePrivy();
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

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">BUILD A MATCHBOX (DEMO)</h2>
          <p className="text-zinc-400 text-sm mb-2">
            Design your conditional sequence. Each leg executes only if the
            previous market resolves in your favor.
          </p>
          <p className="text-[#F57D1F] text-xs">
            {"Note: This is a demo. Functionality is currently being implemented <3"}
          </p>
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
                    MARKET
                  </label>
                  <input
                    type="text"
                    value={leg.market}
                    onChange={(e) => updateLeg(leg.id, 'market', e.target.value)}
                    placeholder="Select or search markets..."
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
            This will create your personal, non-custodial vault and register
            automation triggers. Only you can withdraw funds.
          </p>
          <button
            disabled={!authenticated}
            className={`w-full py-3 rounded font-bold transition-all ${
              authenticated
                ? 'bg-primary hover:opacity-80 text-white'
                : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {authenticated ? 'DEPLOY' : 'LOGIN TO DEPLOY'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

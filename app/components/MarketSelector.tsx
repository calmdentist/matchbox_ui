'use client';

import { useState, useEffect } from 'react';
import { parsePolymarketUrl, PolymarketMarket, parseOutcomes } from '@/lib/polymarket';

interface MarketSelectorProps {
  value: string; // conditionId
  onChange: (conditionId: string, marketData?: PolymarketMarket) => void;
  placeholder?: string;
}

export default function MarketSelector({ value, onChange, placeholder }: MarketSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<PolymarketMarket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse URL when user pastes/types
  useEffect(() => {
    if (!inputValue || inputValue.length < 10) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      const market = await parsePolymarketUrl(inputValue);
      
      if (market) {
        setMarketData(market);
        // API returns both conditionId and condition_id, use whichever is available
        const conditionId = market.conditionId || market.condition_id;
        onChange(conditionId, market);
        setError(null);
      } else {
        setMarketData(null);
        setError('Could not find market. Please check the URL and browser console for details.');
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputValue, onChange]);

  // Update display when value changes externally
  useEffect(() => {
    if (value && !inputValue) {
      // Value was set externally, we might have market data
    }
  }, [value, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear market data when user starts typing
    if (marketData && newValue !== inputValue) {
      setMarketData(null);
      onChange('');
    }
  };

  const isValid = !!(value && marketData);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder || 'Paste Polymarket URL (e.g., https://polymarket.com/event/...)'}
          className={`w-full bg-black border rounded px-3 py-2 pr-10 text-sm focus:outline-none ${
            isValid
              ? 'border-green-800 focus:border-green-600'
              : error
              ? 'border-red-800 focus:border-red-600'
              : 'border-zinc-800 focus:border-primary'
          }`}
        />
        
        {/* Status indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : isValid ? (
            <span className="text-green-500 text-lg">✓</span>
          ) : error ? (
            <span className="text-red-500 text-lg">✗</span>
          ) : (
            <span className="text-zinc-600">🔗</span>
          )}
        </div>
      </div>

      {/* Market info display */}
      {marketData && (
        <div className="bg-zinc-950 border border-green-900/50 rounded p-3 text-xs">
          <div className="text-green-500 font-medium mb-1">✓ Market Found</div>
          <div className="text-zinc-300 mb-2 line-clamp-2">{marketData.question}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-500">Outcomes:</span>
            {parseOutcomes(marketData.outcomes).map((outcome, idx) => (
              <span
                key={idx}
                className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-400"
              >
                {outcome}
              </span>
            ))}
          </div>
          <div className="text-zinc-600 font-mono text-[10px] truncate">
            ID: {marketData.conditionId || marketData.condition_id}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="text-red-500 text-xs">
          {error}
        </div>
      )}

      {/* Help text */}
      {!isValid && !error && !isLoading && (
        <div className="text-zinc-500 text-xs">
          Paste a Polymarket event or market URL
          <div className="mt-1 text-[10px] text-zinc-600">
            Example: https://polymarket.com/event/trump-wins-2024
          </div>
        </div>
      )}
    </div>
  );
}

import { parseUnits } from 'viem';
import { Rule, Leg } from './types';

/**
 * Validate a conditionId (must be a 66-char hex string)
 */
export function isValidConditionId(conditionId: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(conditionId);
}

/**
 * Convert a Leg from the UI into a Rule for the smart contract
 * Prices are stored as fixed point with 18 decimals (e.g., 0.50 = 5e17)
 */
export function legToRule(leg: Leg): Rule {
  // Parse prices from decimal (e.g., "0.50") to wei (18 decimals)
  const minPrice = parseUnits(leg.minPrice || '0', 18);
  const maxPrice = parseUnits(leg.maxPrice || '1', 18);
  
  // Parse amount from USDC (6 decimals)
  const amount = leg.amount ? parseUnits(leg.amount, 6) : 0n;
  
  // For the initial leg, we use the specific amount
  // For subsequent legs, we typically use all funds from the previous step
  const useAllFunds = !leg.isInitial;
  const specificAmount = leg.isInitial ? amount : 0n;

  // outcomeIndex: 0 for NO, 1 for YES
  const outcomeIndex = leg.outcome === 'YES' ? 1n : 0n;

  // Validate that leg.market is a valid conditionId
  if (!isValidConditionId(leg.market)) {
    throw new Error(`Invalid conditionId for market: ${leg.market}`);
  }

  return {
    conditionId: leg.market as `0x${string}`,
    outcomeIndex,
    minPrice,
    maxPrice,
    useAllFunds,
    specificAmount,
  };
}

/**
 * Validate a leg to ensure all required fields are filled
 */
export function validateLeg(leg: Leg): string | null {
  if (!leg.market || leg.market.trim() === '') {
    return 'Market is required - paste a Polymarket URL';
  }
  
  // Validate conditionId format
  if (!isValidConditionId(leg.market)) {
    return 'Invalid market - please paste a valid Polymarket URL';
  }
  
  if (leg.isInitial && (!leg.amount || parseFloat(leg.amount) <= 0)) {
    return 'Initial leg requires a valid amount';
  }

  if (!leg.maxPrice || parseFloat(leg.maxPrice) <= 0 || parseFloat(leg.maxPrice) > 1) {
    return 'Max price must be between 0 and 1';
  }

  if (!leg.minPrice || parseFloat(leg.minPrice) < 0 || parseFloat(leg.minPrice) >= parseFloat(leg.maxPrice)) {
    return 'Min price must be less than max price';
  }

  return null;
}

/**
 * Validate all legs in a sequence
 */
export function validateSequence(legs: Leg[]): string | null {
  if (legs.length === 0) {
    return 'At least one leg is required';
  }

  for (let i = 0; i < legs.length; i++) {
    const error = validateLeg(legs[i]);
    if (error) {
      return `Leg ${i === 0 ? 'INITIAL' : i}: ${error}`;
    }
  }

  return null;
}

/**
 * Format a price from wei (18 decimals) to a readable string
 */
export function formatPrice(price: bigint): string {
  const formatted = Number(price) / 1e18;
  return formatted.toFixed(2);
}

/**
 * Format an amount from USDC (6 decimals) to a readable string
 */
export function formatUSDC(amount: bigint): string {
  const formatted = Number(amount) / 1e6;
  return formatted.toFixed(2);
}


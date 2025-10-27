/**
 * Polymarket API utilities
 * 
 * This file contains functions for interacting with Polymarket's CLOB API
 * to fetch market data, conditionIds, and other market information.
 */

export interface PolymarketMarket {
  condition_id: string;
  conditionId: string; // API returns both snake_case and camelCase
  question: string;
  description?: string;
  end_date_iso?: string;
  endDateIso?: string;
  market_slug?: string;
  slug?: string;
  outcomes: string; // JSON string, needs to be parsed
  active: boolean;
  volume?: string;
  liquidity?: string;
}

/**
 * Parse outcomes from API response (comes as JSON string)
 */
export function parseOutcomes(outcomes: string | string[]): string[] {
  if (Array.isArray(outcomes)) {
    return outcomes;
  }
  
  try {
    const parsed = JSON.parse(outcomes);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface MarketSearchResult {
  conditionId: string;
  question: string;
  slug: string | undefined;
  outcomes: string; // JSON string that needs to be parsed
  isActive: boolean;
}

// Use our Next.js API route to avoid CORS issues
const API_BASE = '/api/polymarket';

/**
 * Fetch data from Polymarket via our API proxy
 */
async function fetchFromPolymarket<T = unknown>(endpoint: string): Promise<T> {
  const url = `${API_BASE}?endpoint=${encodeURIComponent(endpoint)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch from Polymarket: ${response.statusText}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Search for markets on Polymarket by keyword
 * Returns a list of markets matching the search query
 */
export async function searchMarkets(query: string): Promise<MarketSearchResult[]> {
  try {
    const markets = await fetchFromPolymarket<PolymarketMarket[]>('markets');
    
    // Filter markets by query
    const filtered = markets.filter(market => 
      market.question.toLowerCase().includes(query.toLowerCase()) &&
      market.active
    );

    // Convert to our format
    return filtered.slice(0, 20).map(market => ({
      conditionId: market.conditionId || market.condition_id,
      question: market.question,
      slug: market.slug || market.market_slug,
      outcomes: market.outcomes,
      isActive: market.active,
    }));
  } catch (error) {
    console.error('Error searching Polymarket markets:', error);
    return [];
  }
}

/**
 * Get market details by conditionId
 */
export async function getMarketByConditionId(conditionId: string): Promise<PolymarketMarket | null> {
  try {
    const markets = await fetchFromPolymarket<PolymarketMarket[]>('markets');
    const market = markets.find(m => 
      (m.conditionId || m.condition_id).toLowerCase() === conditionId.toLowerCase()
    );
    
    return market || null;
  } catch (error) {
    console.error('Error fetching market details:', error);
    return null;
  }
}

/**
 * Get popular/trending markets
 */
export async function getTrendingMarkets(limit: number = 10): Promise<MarketSearchResult[]> {
  try {
    const markets = await fetchFromPolymarket<PolymarketMarket[]>('markets');
    
    // Filter active markets and sort by volume (if available)
    const active = markets.filter(m => m.active);
    
    return active.slice(0, limit).map(market => ({
      conditionId: market.conditionId || market.condition_id,
      question: market.question,
      slug: market.slug || market.market_slug,
      outcomes: market.outcomes,
      isActive: market.active,
    }));
  } catch (error) {
    console.error('Error fetching trending markets:', error);
    return [];
  }
}

/**
 * Extract market slug from a Polymarket URL
 * Examples:
 * - https://polymarket.com/event/trump-wins-2024 -> trump-wins-2024
 * - https://polymarket.com/market/will-btc-hit-100k -> will-btc-hit-100k
 */
export function extractPolymarketSlug(input: string): string | null {
  try {
    const trimmed = input.trim();
    
    // Check if it's a URL
    if (trimmed.includes('polymarket.com')) {
      const url = new URL(trimmed);
      const pathParts = url.pathname.split('/').filter(Boolean);
      // Format: /event/{slug} or /market/{slug}
      if (pathParts.length >= 2 && (pathParts[0] === 'event' || pathParts[0] === 'market')) {
        return pathParts[1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get market details by slug using direct API lookup
 */
export async function getMarketBySlug(slug: string): Promise<PolymarketMarket | null> {
  try {
    console.log('Looking up market by slug:', slug);
    
    // Use the direct slug lookup endpoint
    const market = await fetchFromPolymarket<PolymarketMarket>(`markets/slug/${slug}`);
    
    console.log('✓ Market found:', market.question);
    console.log('  Condition ID:', market.conditionId || market.condition_id);
    console.log('  Outcomes:', parseOutcomes(market.outcomes));
    
    return market;
  } catch (error) {
    console.error('Error fetching market by slug:', error);
    console.log('✗ No market found for slug:', slug);
    return null;
  }
}

/**
 * Parse Polymarket URL and fetch market data
 * Returns the full market data including conditionId
 */
export async function parsePolymarketUrl(url: string): Promise<PolymarketMarket | null> {
  const slug = extractPolymarketSlug(url);
  if (!slug) {
    console.error('Could not extract slug from URL:', url);
    return null;
  }
  
  console.log('Extracted slug:', slug);
  
  // Direct event lookup disabled - Polymarket API returns 422
  // Search all markets instead
  return await getMarketBySlug(slug);
}


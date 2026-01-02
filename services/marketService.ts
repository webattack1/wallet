import { Asset } from '../types';

/**
 * Simulates fetching live market data.
 * In a real app, this would call an API like CoinGecko or Binance.
 */
export const getLatestMarketData = async (currentAssets: Asset[]): Promise<Asset[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return currentAssets.map(asset => {
    // Generate a small random fluctuation to simulate live market
    const fluctuation = (Math.random() - 0.5) * 0.02; 
    const newPrice = asset.priceUsd + fluctuation;
    
    // Update change percentage slightly
    const newChange = asset.change24h + (Math.random() - 0.5) * 0.1;

    return {
      ...asset,
      priceUsd: parseFloat(newPrice.toFixed(4)),
      change24h: parseFloat(newChange.toFixed(2))
    };
  });
};

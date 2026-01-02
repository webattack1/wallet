export interface Asset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  change24h: number; // Percentage
  iconColor: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'sbp';
}

export interface User {
  nickname: string;
  avatarUrl: string;
}

import React from 'react';
import { Asset, PaymentMethod } from './types';

// Initial dummy data
export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether',
    balance: 0.00,
    priceUsd: 1.00,
    change24h: 0.01,
    iconColor: 'bg-teal-500'
  },
  {
    id: 'toncoin',
    symbol: 'TON',
    name: 'Toncoin',
    balance: 0.00,
    priceUsd: 5.42,
    change24h: -1.24,
    iconColor: 'bg-blue-500'
  }
];

export const DEPOSIT_METHODS: PaymentMethod[] = [
  { id: 'sbp', name: 'СБП (Система Быстрых Платежей)', type: 'sbp', icon: '⚡' },
  { id: 'ru_card', name: 'Банковская карта (RU)', type: 'card', icon: '🇷🇺' },
  { id: 'ua_card', name: 'Банковская карта (UA)', type: 'card', icon: '🇺🇦' },
  { id: 'eu_card', name: 'Банковская карта (EU)', type: 'card', icon: '🇪🇺' },
];

export const USER_NICKNAME = "test";
export const USER_WALLET_ADDRESS = "UQDc2wT_7-4-6_5-8_9-0_1-2_3-4_5-6_7-8_9-0_1"; // Mock TON address
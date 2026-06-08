// TODO: remove when real API sandbox is available
// Replace each function call in components with the real api.ts equivalent

import type { DCAplan, PriceAlert, Transaction, Wallet } from '@/types'

export const mockUser = {
  chat_id: 123456789,
  username: 'datharnu',
  first_name: 'Emmanuel',
  kyc_verified: false,
  kyc_level: 0,
  referral_code: 'iYM00P',
}

export const mockWallets: Wallet[] = [
  { wallet_type: 'btc', blockchain: 'bitcoin', balance: '0.00230000', deposit_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { wallet_type: 'usdt', blockchain: 'tron', balance: '12420.78', deposit_address: 'TXyzABCDEF1234567890' },
  { wallet_type: 'naira', blockchain: null, balance: '284500.00', deposit_address: '0123456789' },
]

export const mockRates = {
  USD: { buy: '1430.00', sell: '1340.00' },
  BTC: { buy: '76560.66', sell: '76200.00' },
  ETH: { buy: '2110.47', sell: '2090.00' },
  USDT: { buy: '1430.00', sell: '1340.00' },
}

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'buy', asset: 'BTC', amount: '0.000062', amount_ngn: '5000', date: '2026-06-08T09:34:00', is_dca: true },
  { id: '2', type: 'swap', asset: 'USDT', amount: '20.00', amount_ngn: '28600', date: '2026-06-08T08:12:00', is_dca: false },
  { id: '3', type: 'sell', asset: 'BTC', amount: '0.0010', amount_ngn: '76500', date: '2026-06-07T16:45:00', is_dca: false },
  { id: '4', type: 'buy', asset: 'USDT', amount: '50.00', amount_ngn: '71500', date: '2026-06-07T11:20:00', is_dca: false },
  { id: '5', type: 'deposit', asset: 'USDT', amount: '100.00', amount_ngn: '143000', date: '2026-06-06T14:30:00', is_dca: false },
  { id: '6', type: 'buy', asset: 'ETH', amount: '0.015', amount_ngn: '32000', date: '2026-06-06T10:05:00', is_dca: false },
  { id: '7', type: 'withdrawal', asset: 'USDT', amount: '30.00', amount_ngn: '42900', date: '2026-06-05T18:22:00', is_dca: false },
  { id: '8', type: 'buy', asset: 'BTC', amount: '0.0005', amount_ngn: '38000', date: '2026-06-05T09:15:00', is_dca: true },
  { id: '9', type: 'swap', asset: 'BTC', amount: '0.0008', amount_ngn: '61200', date: '2026-06-04T13:40:00', is_dca: false },
  { id: '10', type: 'sell', asset: 'USDT', amount: '75.00', amount_ngn: '100500', date: '2026-06-03T17:55:00', is_dca: false },
  { id: '11', type: 'buy', asset: 'USDT', amount: '25.00', amount_ngn: '35750', date: '2026-06-02T12:08:00', is_dca: false },
  { id: '12', type: 'sell', asset: 'ETH', amount: '0.02', amount_ngn: '42000', date: '2026-06-01T08:30:00', is_dca: false },
]

export const mockAlerts: PriceAlert[] = [
  {
    id: 'alert-1',
    asset: 'USD/NGN',
    direction: 'above',
    target: 1500,
    current: 1430,
    active: true,
    type: 'naira_rate',
  },
  {
    id: 'alert-2',
    asset: 'BTC',
    direction: 'below',
    target: 70000,
    current: 76560,
    active: true,
    type: 'crypto',
  },
]

export const mockDCAPlans: DCAplan[] = [
  {
    id: 'dca-1',
    asset: 'BTC',
    amount_ngn: 5000,
    frequency: 'weekly',
    total_buys: 12,
    completed_buys: 8,
    next_run: '2026-06-15T09:00:00',
    active: true,
  },
  {
    id: 'dca-2',
    asset: 'USDT',
    amount_ngn: 10000,
    frequency: 'monthly',
    total_buys: 6,
    completed_buys: 2,
    next_run: '2026-07-01T09:00:00',
    active: true,
  },
]

export const mockReferral = {
  total_invited: 12,
  total_earned: '4200.00',
  rank: 12,
  leaderboard: [
    { username: 'shawna33x', referrals: 148, earned: '62400' },
    { username: 'Michaeayo', referrals: 134, earned: '51200' },
    { username: 'toludev2', referrals: 119, earned: '44800' },
    { username: 'mac_for_president', referrals: 98, earned: '38100' },
    { username: 'Majeedsani', referrals: 87, earned: '31200' },
    { username: 'crypto_queen', referrals: 76, earned: '28400' },
    { username: 'ngn_trader', referrals: 64, earned: '24100' },
    { username: 'swift_kid', referrals: 52, earned: '19800' },
    { username: 'hodl_ng', referrals: 41, earned: '15600' },
    { username: 'btc_bae', referrals: 33, earned: '12400' },
  ],
}

/**
 * Simulated demo data for features without hackathon API endpoints.
 *
 * Live API data (user, wallets, transactions, rates) comes from `src/lib/api.ts`.
 * Import from this file only for SIMULATED features — see `src/lib/data-source.ts`.
 */

import type { DCAplan, PriceAlert, Transaction, Wallet } from '@/types'

/** Dev-only fallback when Telegram initData / API is unavailable */
export const mockUser = {
  chat_id: 123456789,
  username: 'datharnu',
  first_name: 'Emmanuel',
  kyc_verified: false,
  kyc_level: 0,
  referral_code: 'DEMO123',
}

/** Dev-only — not used when live wallets API succeeds */
export const mockWallets: Wallet[] = [
  { wallet_type: 'btc', blockchain: 'bitcoin', balance: '0.00230000', deposit_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { wallet_type: 'usdt', blockchain: 'tron', balance: '12420.78', deposit_address: 'TXyzABCDEF1234567890' },
  { wallet_type: 'usd', blockchain: 'usd', balance: '500.00', deposit_address: null },
  { wallet_type: 'naira', blockchain: null, balance: '284500.00', deposit_address: '0123456789' },
]

/** Fallback rates shape — live rates merged in api.ts; BTC/ETH filled when API omits them */
export const mockRates = {
  USD: { buy: '1430.00', sell: '1340.00' },
  BTC: { buy: '76560.66', sell: '76200.00' },
  ETH: { buy: '2110.47', sell: '2090.00' },
  USDT: { buy: '1430.00', sell: '1340.00' },
}

/** Dev-only transaction samples */
export const mockTransactions: Transaction[] = [
  { id: '1', type: 'buy', asset: 'BTC', amount: '0.000062', amount_ngn: '5000', date: '2026-06-08T09:34:00', is_dca: true },
  { id: '2', type: 'swap', asset: 'USDT', amount: '20.00', amount_ngn: '28600', date: '2026-06-08T08:12:00', is_dca: false },
  { id: '3', type: 'sell', asset: 'BTC', amount: '0.0010', amount_ngn: '76500', date: '2026-06-07T16:45:00', is_dca: false },
  { id: '4', type: 'buy', asset: 'USDT', amount: '50.00', amount_ngn: '71500', date: '2026-06-07T11:20:00', is_dca: false },
  { id: '5', type: 'deposit', asset: 'USDT', amount: '100.00', amount_ngn: '143000', date: '2026-06-06T14:30:00', is_dca: false },
]

/** SIMULATED — price alerts (Actions tab) */
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

/** SIMULATED — DCA plans (Actions tab) */
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

/** SIMULATED — referral earnings & leaderboard (referral_code comes from live /me) */
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

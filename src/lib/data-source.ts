/**
 * Hackathon data-source map
 *
 * LIVE — backed by Cordial Exchange mini-app APIs (initData auth)
 * SIMULATED — local demo data until backend endpoints exist
 */

export const LIVE_ENDPOINTS = {
  user: 'POST /miniapp/me',
  wallets: 'POST /miniapp/wallets',
  transactions: 'POST /miniapp/transactions',
  rates: 'GET /miniapp/rates',
} as const

/** Features that intentionally use simulated data in this build */
export const SIMULATED_FEATURES = {
  referralStats: 'Referral earnings, rank & leaderboard',
  referralTiers: 'Tier progress ladder',
  portfolioChart: 'Portfolio history chart',
  portfolioPnL: 'Profit & loss statistics',
  priceAlerts: 'Price alerts (Actions tab)',
  dcaPlans: 'DCA plans (Actions tab)',
  aiAssistant: 'AI assistant responses',
  quickActionsBot: 'Deposit/withdraw/swap/OTC bot handoff UI',
} as const

export type SimulatedFeatureKey = keyof typeof SIMULATED_FEATURES

/** Enable mock fallbacks for live APIs when developing outside Telegram */
export function isDevMockFallbackEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_MOCK_FALLBACK === 'true'
}

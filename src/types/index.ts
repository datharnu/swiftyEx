export interface TelegramUser {
  id: number
  first_name: string
  username?: string
  language_code?: string
}

export interface UserProfile {
  chat_id: number
  username: string
  first_name: string
  kyc_verified: boolean
  kyc_level: number
  referral_code: string
}

export interface Wallet {
  wallet_type: 'btc' | 'ethereum' | 'usdt' | 'naira'
  blockchain: string | null
  balance: string
  deposit_address: string | null
}

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'swap' | 'deposit' | 'withdrawal'
  asset: string
  amount: string
  amount_ngn: string
  date: string
  is_dca: boolean
}

export interface Rate {
  buy: string
  sell: string
}

export interface Rates {
  USD: Rate
  BTC: Rate
  ETH: Rate
  USDT: Rate
}

export interface ReferralStats {
  total_invited: number
  total_earned: string
  rank: number
  leaderboard: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  username: string
  referrals: number
  earned: string
}

export interface DCAplan {
  id: string
  asset: string
  amount_ngn: number
  frequency: 'daily' | 'weekly' | 'monthly'
  total_buys: number
  completed_buys: number
  next_run: string
  active: boolean
}

export interface PriceAlert {
  id: string
  asset: string
  direction: 'above' | 'below'
  target: number
  current: number
  active: boolean
  type: 'crypto' | 'naira_rate'
}

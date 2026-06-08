export interface TelegramUser {
  id: number
  first_name: string
  username?: string
  language_code?: string
}

export interface KycLevel {
  level_id: number
  level_name: string
  daily_limit: number
  monthly_limit: number
}

export interface UserProfile {
  chat_id: string | number
  username: string
  first_name: string
  name?: string | null
  kyc_verified: boolean
  kyc_level: KycLevel | number
  referral_code: string
}

export type WalletType = 'btc' | 'ethereum' | 'usdt' | 'usd' | 'naira'

export interface Wallet {
  wallet_type: WalletType
  blockchain: string | null
  balance: string
  deposit_address: string | null
}

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'processing'

export interface Transaction {
  id: string
  type: 'buy' | 'sell' | 'swap' | 'deposit' | 'withdrawal'
  asset: string
  amount: string
  amount_ngn: string
  date: string
  is_dca: boolean
  status?: TransactionStatus
}

export interface TransactionsPage {
  transactions: Transaction[]
  count: number
  page: number
  page_size: number
  has_next: boolean
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

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

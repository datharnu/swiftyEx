import axios from 'axios'
import { mockRates } from './mock'
import { getInitData } from './telegram'
import type { Rates, Transaction, UserProfile, Wallet } from '@/types'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://bot.cordialexchange.com'

export const TRANSACTIONS_PAGE_SIZE = 20

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = {
      ...config.data,
      initData: getInitData(),
    }
  }
  return config
})

interface ApiRateItem {
  symbol: string
  buy: string
  sell: string
}

export function parseRatesResponse(data: unknown): Rates {
  if (data && typeof data === 'object' && 'USD' in data) {
    return data as Rates
  }

  const rates = Array.isArray((data as { rates?: ApiRateItem[] })?.rates)
    ? (data as { rates: ApiRateItem[] }).rates
    : null

  if (!rates?.length) return mockRates

  const result: Rates = { ...mockRates }

  for (const item of rates) {
    const rate = { buy: item.buy, sell: item.sell }
    const sym = item.symbol.toLowerCase()

    if (sym === 'usdnaira' || sym === 'usd' || sym === 'ngn') {
      result.USD = rate
      result.USDT = rate
    } else if (sym === 'btc' || sym === 'bitcoin') {
      result.BTC = rate
    } else if (sym === 'eth' || sym === 'ethereum') {
      result.ETH = rate
    } else if (sym === 'usdt') {
      result.USDT = rate
    }
  }

  return result
}

export function parseUserResponse(data: unknown): UserProfile | null {
  if (!data || typeof data !== 'object' || 'error' in data) return null
  const user = data as UserProfile
  if (typeof user.chat_id !== 'number') return null
  return user
}

export function parseWalletsResponse(data: unknown): Wallet[] {
  if (Array.isArray(data)) return data as Wallet[]
  if (data && typeof data === 'object' && Array.isArray((data as { wallets?: Wallet[] }).wallets)) {
    return (data as { wallets: Wallet[] }).wallets
  }
  return []
}

export function parseTransactionsResponse(data: unknown): Transaction[] {
  if (Array.isArray(data)) return data as Transaction[]
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as { transactions?: Transaction[] }).transactions)
  ) {
    return (data as { transactions: Transaction[] }).transactions
  }
  return []
}

export const getMe = () => api.post<UserProfile>('/miniapp/me')
export const getWallets = () => api.post('/miniapp/wallets')
export const getTransactions = (page = 1, wallet_type = '') =>
  api.post('/miniapp/transactions', { page, wallet_type })
export const getRates = () => api.get('/miniapp/rates')

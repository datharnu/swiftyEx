import axios, { type InternalAxiosRequestConfig } from 'axios'
import {
  endpointIdFromUrl,
  fullApiUrl,
  isApiDebugEnabled,
  previewInitData,
} from './apiDebug'
import { mockRates } from './mock'
import { getInitData } from './telegram'
import { useApiDebugStore } from '@/store/useApiDebugStore'
import type { Rates, Transaction, TransactionsPage, UserProfile, Wallet } from '@/types'

interface RequestMeta {
  startTime: number
  logId: string
}

function parseRequestBody(data: unknown): unknown {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }
  return data ?? null
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://bot.cordialexchange.com'

export const TRANSACTIONS_PAGE_SIZE = 20

export const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.method === 'post') {
    config.data = {
      ...config.data,
      initData: getInitData(),
    }
  }

  if (isApiDebugEnabled) {
    const logId = crypto.randomUUID()
    const url = config.url ?? ''
    const method = (config.method ?? 'get').toUpperCase()
    const body = parseRequestBody(config.data)
    const initData =
      body && typeof body === 'object'
        ? String((body as { initData?: string }).initData ?? '')
        : method === 'POST'
          ? getInitData()
          : ''

    ;(config as InternalAxiosRequestConfig & { metadata: RequestMeta }).metadata = {
      startTime: Date.now(),
      logId,
    }

    const entry = {
      id: logId,
      endpointId: endpointIdFromUrl(url),
      method,
      url,
      fullUrl: fullApiUrl(url, API_BASE_URL),
      requestBody: body,
      initDataPreview: previewInitData(initData),
      status: null,
      responseBody: null,
      error: null,
      durationMs: 0,
      timestamp: new Date().toLocaleTimeString('en-NG'),
      state: 'pending' as const,
    }

    useApiDebugStore.getState().addLog(entry)
    console.log(`[API →] ${method} ${entry.fullUrl}`, body)
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    if (isApiDebugEnabled) {
      const meta = (response.config as InternalAxiosRequestConfig & { metadata?: RequestMeta }).metadata
      const body = parseRequestBody(response.config.data)
      const initData =
        body && typeof body === 'object'
          ? String((body as { initData?: string }).initData ?? '')
          : getInitData()

      const logId = meta?.logId ?? crypto.randomUUID()
      const durationMs = meta ? Date.now() - meta.startTime : 0
      const updates = {
        requestBody: body,
        initDataPreview: previewInitData(initData),
        status: response.status,
        responseBody: response.data,
        error: null,
        durationMs,
        state: 'success' as const,
      }

      if (meta?.logId) {
        useApiDebugStore.getState().updateLog(logId, updates)
      } else {
        useApiDebugStore.getState().addLog({
          id: logId,
          endpointId: endpointIdFromUrl(response.config.url ?? ''),
          method: (response.config.method ?? 'get').toUpperCase(),
          url: response.config.url ?? '',
          fullUrl: fullApiUrl(response.config.url ?? '', API_BASE_URL),
          timestamp: new Date().toLocaleTimeString('en-NG'),
          ...updates,
        })
      }

      console.log(`[API ✓] ${response.status} ${fullApiUrl(response.config.url ?? '', API_BASE_URL)}`, response.data)
    }
    return response
  },
  (error) => {
    if (isApiDebugEnabled) {
      const config = error.config as (InternalAxiosRequestConfig & { metadata?: RequestMeta }) | undefined
      const meta = config?.metadata
      const body = parseRequestBody(config?.data)
      const initData =
        body && typeof body === 'object'
          ? String((body as { initData?: string }).initData ?? '')
          : getInitData()

      const logId = meta?.logId ?? crypto.randomUUID()
      const durationMs = meta ? Date.now() - meta.startTime : 0
      const updates = {
        requestBody: body,
        initDataPreview: previewInitData(initData),
        status: error.response?.status ?? null,
        responseBody: error.response?.data ?? null,
        error: error.message ?? 'Request failed',
        durationMs,
        state: 'error' as const,
      }

      if (meta?.logId) {
        useApiDebugStore.getState().updateLog(logId, updates)
      } else {
        useApiDebugStore.getState().addLog({
          id: logId,
          endpointId: endpointIdFromUrl(config?.url ?? ''),
          method: (config?.method ?? 'get').toUpperCase(),
          url: config?.url ?? 'unknown',
          fullUrl: fullApiUrl(config?.url ?? '', API_BASE_URL),
          timestamp: new Date().toLocaleTimeString('en-NG'),
          ...updates,
        })
      }

      console.error(`[API ✗] ${error.response?.status ?? 'ERR'} ${fullApiUrl(config?.url ?? '', API_BASE_URL)}`, error.response?.data ?? error.message)
    }
    return Promise.reject(error)
  },
)

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

  // Live USD/NGN from API; BTC/ETH slots use demo values until rate API expands
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

interface ApiWallet {
  wallet_type: string
  blockchain: string | null
  balance: string
  address?: string | null
  deposit_address?: string | null
}

interface ApiTransaction {
  id?: string | number
  type?: string
  transaction_type?: string
  asset?: string
  wallet_type?: string
  amount?: string
  amount_ngn?: string
  ngn_amount?: string
  date?: string
  created_at?: string
  is_dca?: boolean
  status?: string
}

function normalizeWallet(raw: ApiWallet): Wallet {
  return {
    wallet_type: raw.wallet_type as Wallet['wallet_type'],
    blockchain: raw.blockchain,
    balance: raw.balance,
    deposit_address: raw.deposit_address ?? raw.address ?? null,
  }
}

function normalizeTransaction(raw: ApiTransaction, index: number): Transaction {
  const type = (raw.type ?? raw.transaction_type ?? 'deposit') as Transaction['type']
  const status = raw.status as Transaction['status'] | undefined

  return {
    id: String(raw.id ?? `tx-${index}`),
    type,
    asset: (raw.asset ?? raw.wallet_type ?? 'USDT').toUpperCase(),
    amount: raw.amount ?? '0',
    amount_ngn: raw.amount_ngn ?? raw.ngn_amount ?? '0',
    date: raw.date ?? raw.created_at ?? new Date().toISOString(),
    is_dca: raw.is_dca ?? false,
    status: status ?? 'completed',
  }
}

export function parseUserResponse(data: unknown): UserProfile | null {
  if (!data || typeof data !== 'object' || 'error' in data) return null
  const user = data as UserProfile
  if (user.chat_id == null || user.chat_id === '') return null
  return user
}

export function parseWalletsResponse(data: unknown): Wallet[] {
  if (Array.isArray(data)) {
    return (data as ApiWallet[]).map(normalizeWallet)
  }
  if (data && typeof data === 'object' && Array.isArray((data as { wallets?: ApiWallet[] }).wallets)) {
    return (data as { wallets: ApiWallet[] }).wallets.map(normalizeWallet)
  }
  return []
}

export function parseTransactionsResponse(data: unknown): Transaction[] {
  return parseTransactionsPage(data).transactions
}

export function parseTransactionsPage(data: unknown): TransactionsPage {
  const empty: TransactionsPage = {
    transactions: [],
    count: 0,
    page: 1,
    page_size: TRANSACTIONS_PAGE_SIZE,
    has_next: false,
  }

  if (Array.isArray(data)) {
    return {
      ...empty,
      transactions: (data as ApiTransaction[]).map(normalizeTransaction),
      count: data.length,
    }
  }

  if (!data || typeof data !== 'object') return empty

  const payload = data as {
    results?: ApiTransaction[]
    transactions?: ApiTransaction[]
    count?: number
    page?: number
    page_size?: number
    has_next?: boolean
  }

  const rawList = payload.results ?? payload.transactions ?? []
  const transactions = rawList.map(normalizeTransaction)

  return {
    transactions,
    count: payload.count ?? transactions.length,
    page: payload.page ?? 1,
    page_size: payload.page_size ?? TRANSACTIONS_PAGE_SIZE,
    has_next: payload.has_next ?? transactions.length >= TRANSACTIONS_PAGE_SIZE,
  }
}

export const getMe = () => api.post<UserProfile>('/miniapp/me')
export const getWallets = () => api.post('/miniapp/wallets')
export const getTransactions = (page = 1, wallet_type = '') =>
  api.post('/miniapp/transactions', { page, wallet_type })
export const getRates = () => api.get('/miniapp/rates')

/** Fire every mini-app endpoint — useful for debug panel verification */
export const pingAllEndpoints = () =>
  Promise.allSettled([getMe(), getWallets(), getRates(), getTransactions(1, '')])

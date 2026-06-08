import { create } from 'zustand'
import {
  getMe,
  getRates,
  getTransactions,
  getWallets,
  parseRatesResponse,
  parseTransactionsPage,
  parseUserResponse,
  parseWalletsResponse,
} from '@/lib/api'
import { isDevMockFallbackEnabled } from '@/lib/data-source'
import {
  mockAlerts,
  mockDCAPlans,
  mockRates,
  mockTransactions,
  mockUser,
  mockWallets,
} from '@/lib/mock'
import type { UserProfile, Wallet, Transaction, Rates, DCAplan, PriceAlert } from '@/types'

interface AppStore {
  user: UserProfile | null
  wallets: Wallet[]
  transactions: Transaction[]
  transactionCount: number
  rates: Rates | null
  dcaPlans: DCAplan[]
  alerts: PriceAlert[]
  isLoading: boolean
  isRefreshing: boolean
  isInitialized: boolean
  error: string | null
  setUser: (user: UserProfile) => void
  setWallets: (wallets: Wallet[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setRates: (rates: Rates) => void
  addDCAPlan: (plan: DCAplan) => void
  removeDCAPlan: (id: string) => void
  addAlert: (alert: PriceAlert) => void
  removeAlert: (id: string) => void
  fetchAppData: () => Promise<void>
  refreshAppData: () => Promise<void>
  fetchRates: () => Promise<Rates>
  fetchTransactions: (
    page?: number,
    wallet_type?: string,
  ) => Promise<{ transactions: Transaction[]; has_next: boolean; count: number }>
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  wallets: [],
  transactions: [],
  transactionCount: 0,
  rates: null,
  dcaPlans: mockDCAPlans,
  alerts: mockAlerts,
  isLoading: false,
  isRefreshing: false,
  isInitialized: false,
  error: null,

  setUser: (user) => set({ user }),
  setWallets: (wallets) => set({ wallets }),
  setTransactions: (transactions) => set({ transactions }),
  setRates: (rates) => set({ rates }),
  addDCAPlan: (plan) => set((s) => ({ dcaPlans: [...s.dcaPlans, plan] })),
  removeDCAPlan: (id) => set((s) => ({ dcaPlans: s.dcaPlans.filter((p) => p.id !== id) })),
  addAlert: (alert) => set((s) => ({ alerts: [...s.alerts, alert] })),
  removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

  fetchRates: async () => {
    try {
      const res = await getRates()
      const rates = parseRatesResponse(res.data)
      set({ rates })
      return rates
    } catch {
      const fallback = isDevMockFallbackEnabled() ? mockRates : get().rates ?? mockRates
      set({ rates: fallback })
      return fallback
    }
  },

  fetchTransactions: async (page = 1, wallet_type = '') => {
    try {
      const res = await getTransactions(page, wallet_type)
      const parsed = parseTransactionsPage(res.data)
      return {
        transactions: parsed.transactions,
        has_next: parsed.has_next,
        count: parsed.count,
      }
    } catch {
      if (!isDevMockFallbackEnabled()) {
        return { transactions: [], has_next: false, count: 0 }
      }

      const filtered = wallet_type
        ? mockTransactions.filter((t) => {
            if (wallet_type === 'usdt') return t.asset === 'USDT'
            if (wallet_type === 'btc') return t.asset === 'BTC'
            if (wallet_type === 'naira') return t.type === 'deposit' || t.type === 'withdrawal'
            return true
          })
        : mockTransactions

      return {
        transactions: filtered,
        has_next: false,
        count: filtered.length,
      }
    }
  },

  fetchAppData: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const [meRes, walletsRes, ratesRes, txRes] = await Promise.all([
        getMe(),
        getWallets(),
        getRates(),
        getTransactions(1, ''),
      ])

      const user = parseUserResponse(meRes.data)
      const wallets = parseWalletsResponse(walletsRes.data)
      const rates = parseRatesResponse(ratesRes.data)
      const txPage = parseTransactionsPage(txRes.data)

      if (!user && isDevMockFallbackEnabled()) {
        set({
          user: mockUser,
          wallets: wallets.length ? wallets : mockWallets,
          rates,
          transactions: txPage.transactions,
          transactionCount: txPage.count,
          isLoading: false,
          isInitialized: true,
          error: null,
        })
        return
      }

      set({
        user,
        wallets,
        rates,
        transactions: txPage.transactions,
        transactionCount: txPage.count,
        isLoading: false,
        isInitialized: true,
        error: null,
      })
    } catch {
      if (isDevMockFallbackEnabled()) {
        set({
          user: mockUser,
          wallets: mockWallets,
          rates: mockRates,
          transactions: mockTransactions,
          transactionCount: mockTransactions.length,
          isLoading: false,
          isInitialized: true,
          error: null,
        })
        return
      }

      set({
        user: null,
        wallets: [],
        rates: null,
        transactions: [],
        transactionCount: 0,
        isLoading: false,
        isInitialized: true,
        error: 'Unable to load your data. Pull down to retry.',
      })
    }
  },

  refreshAppData: async () => {
    set({ isRefreshing: true, error: null })

    try {
      const [meRes, walletsRes, ratesRes, txRes] = await Promise.all([
        getMe(),
        getWallets(),
        getRates(),
        getTransactions(1, ''),
      ])

      const user = parseUserResponse(meRes.data)
      const wallets = parseWalletsResponse(walletsRes.data)
      const rates = parseRatesResponse(ratesRes.data)
      const txPage = parseTransactionsPage(txRes.data)

      set({
        user: user ?? get().user,
        wallets,
        rates,
        transactions: txPage.transactions,
        transactionCount: txPage.count,
        isRefreshing: false,
        error: null,
      })
    } catch {
      set({
        isRefreshing: false,
        error: 'Refresh failed. Please try again.',
      })
    }
  },
}))

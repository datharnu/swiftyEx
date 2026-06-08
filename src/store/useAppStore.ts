import { create } from 'zustand'
import {
  getMe,
  getRates,
  getTransactions,
  getWallets,
  parseRatesResponse,
  parseTransactionsResponse,
  parseUserResponse,
  parseWalletsResponse,
} from '@/lib/api'
import { mockAlerts, mockDCAPlans, mockRates, mockTransactions, mockUser, mockWallets } from '@/lib/mock'
import type { UserProfile, Wallet, Transaction, Rates, DCAplan, PriceAlert } from '@/types'

interface AppStore {
  user: UserProfile | null
  wallets: Wallet[]
  transactions: Transaction[]
  rates: Rates | null
  dcaPlans: DCAplan[]
  alerts: PriceAlert[]
  isLoading: boolean
  isInitialized: boolean
  setUser: (user: UserProfile) => void
  setWallets: (wallets: Wallet[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setRates: (rates: Rates) => void
  addDCAPlan: (plan: DCAplan) => void
  removeDCAPlan: (id: string) => void
  addAlert: (alert: PriceAlert) => void
  removeAlert: (id: string) => void
  fetchAppData: () => Promise<void>
  fetchRates: () => Promise<Rates>
  fetchTransactions: (page?: number, wallet_type?: string) => Promise<Transaction[]>
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  wallets: [],
  transactions: [],
  rates: null,
  dcaPlans: mockDCAPlans,
  alerts: mockAlerts,
  isLoading: false,
  isInitialized: false,

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
      set({ rates: mockRates })
      return mockRates
    }
  },

  fetchTransactions: async (page = 1, wallet_type = '') => {
    try {
      const res = await getTransactions(page, wallet_type)
      return parseTransactionsResponse(res.data)
    } catch {
      if (wallet_type) {
        return mockTransactions.filter((t) => {
          if (wallet_type === 'usdt') return t.asset === 'USDT'
          if (wallet_type === 'btc') return t.asset === 'BTC'
          if (wallet_type === 'naira') return t.type === 'deposit' || t.type === 'withdrawal'
          return true
        })
      }
      return mockTransactions
    }
  },

  fetchAppData: async () => {
    if (get().isLoading) return

    set({ isLoading: true })

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
      const transactions = parseTransactionsResponse(txRes.data)

      set({
        user: user ?? mockUser,
        wallets: wallets.length ? wallets : mockWallets,
        rates,
        transactions: transactions.length ? transactions : mockTransactions,
        isLoading: false,
        isInitialized: true,
      })
    } catch {
      set({
        user: mockUser,
        wallets: mockWallets,
        rates: mockRates,
        transactions: mockTransactions,
        isLoading: false,
        isInitialized: true,
      })
    }
  },
}))

import { colors } from '@/lib/colors'
import type { Rates, Wallet } from '@/types'

export type ChartRange = 'W' | 'M' | '3M' | '6M' | 'Y' | 'All'

export interface Holding {
  id: 'btc' | 'usd' | 'naira'
  label: string
  symbol: string
  balance: string
  valueNgn: number
  percent: number
  color: string
}

export interface ChartPoint {
  label: string
  fullLabel: string
  value: number
}

export interface PnLStats {
  monthChange: number
  monthPercent: number
  allTimeChange: number
  allTimePercent: number
}

const RATE_KEY: Record<string, keyof Rates> = {
  btc: 'BTC',
  usdt: 'USDT',
  ethereum: 'ETH',
}

function parseNum(value: string) {
  return Number(value.replace(/,/g, '')) || 0
}

export function walletValueNgn(wallet: Wallet, rates: Rates): number {
  const balance = parseNum(wallet.balance)

  if (wallet.wallet_type === 'naira') return balance

  const key = RATE_KEY[wallet.wallet_type]
  if (!key) return 0

  return balance * parseNum(rates[key].sell)
}

export function totalPortfolioNgn(wallets: Wallet[], rates: Rates): number {
  return wallets.reduce((sum, wallet) => sum + walletValueNgn(wallet, rates), 0)
}

export function computeHoldings(wallets: Wallet[], rates: Rates): Holding[] {
  const defs: Omit<Holding, 'balance' | 'valueNgn' | 'percent'>[] = [
    { id: 'btc', label: 'Bitcoin', symbol: '₿', color: colors.blue },
    { id: 'usd', label: 'USD', symbol: '$', color: colors.ink },
    { id: 'naira', label: 'Naira', symbol: '₦', color: colors.teal },
  ]

  const walletKey: Record<Holding['id'], Wallet['wallet_type'] | 'usdt'> = {
    btc: 'btc',
    usd: 'usdt',
    naira: 'naira',
  }

  const holdings = defs.map((def) => {
    const wallet = wallets.find((w) => w.wallet_type === walletKey[def.id])
    const balance = wallet?.balance ?? '0'
    const valueNgn = wallet ? walletValueNgn(wallet, rates) : 0
    return { ...def, balance, valueNgn, percent: 0 }
  })

  const total = holdings.reduce((sum, h) => sum + h.valueNgn, 0) || 1

  return holdings.map((h) => ({
    ...h,
    percent: (h.valueNgn / total) * 100,
  }))
}

function seededValue(seed: number, base: number, spread = 0.12) {
  const wave = Math.sin(seed * 1.7) * 0.06 + Math.cos(seed * 0.9) * 0.04
  return base * (1 + wave + (seed % 5) * 0.015 - spread / 2)
}

export function mockChartData(range: ChartRange, totalNgn: number): ChartPoint[] {
  const base = totalNgn || 3_750_000

  const configs: Record<ChartRange, { count: number; labels: (i: number) => string; full: (i: number) => string }> = {
    W: {
      count: 7,
      labels: (i) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] ?? `D${i + 1}`,
      full: (i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      },
    },
    M: {
      count: 4,
      labels: (i) => `W${i + 1}`,
      full: (i) => `Week ${i + 1}`,
    },
    '3M': {
      count: 3,
      labels: (i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (2 - i))
        return d.toLocaleDateString('en-US', { month: 'short' })
      },
      full: (i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (2 - i))
        return d.toLocaleDateString('en-US', { month: 'long' })
      },
    },
    '6M': {
      count: 6,
      labels: (i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        return d.toLocaleDateString('en-US', { month: 'short' })
      },
      full: (i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        return d.toLocaleDateString('en-US', { month: 'long' })
      },
    },
    Y: {
      count: 12,
      labels: (i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (11 - i))
        return d.toLocaleDateString('en-US', { month: 'short' })
      },
      full: (i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (11 - i))
        return d.toLocaleDateString('en-US', { month: 'long' })
      },
    },
    All: {
      count: 8,
      labels: (i) => `${2026 - (7 - i)}`,
      full: (i) => `${2026 - (7 - i)}`,
    },
  }

  const cfg = configs[range]

  return Array.from({ length: cfg.count }, (_, i) => ({
    label: cfg.labels(i),
    fullLabel: cfg.full(i),
    value: seededValue(i + range.length, base),
  }))
}

export function mockPnL(totalNgn: number): PnLStats {
  const base = totalNgn || 3_750_000
  const monthChange = base * 0.034
  const allTimeChange = base * 0.128

  return {
    monthChange,
    monthPercent: 3.4,
    allTimeChange,
    allTimePercent: 12.8,
  }
}

export function formatNgn(value: number, compact = false) {
  if (compact && value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(2)}M`
  }
  return `₦${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatBalance(balance: string, isCrypto = false) {
  const num = parseNum(balance)
  if (isCrypto) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

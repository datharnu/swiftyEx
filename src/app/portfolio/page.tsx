'use client'

import { useMemo } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { HoldingsList } from '@/components/portfolio/HoldingsList'
import { PnLStats } from '@/components/portfolio/PnLStats'
import { PortfolioChart } from '@/components/portfolio/PortfolioChart'
import { PortfolioTransactions } from '@/components/portfolio/PortfolioTransactions'
import { TotalValue } from '@/components/portfolio/TotalValue'
import { mockRates } from '@/lib/mock'
import { computeHoldings, mockPnL, totalPortfolioNgn } from '@/lib/portfolio'
import { colors } from '@/lib/colors'
import { useAppStore } from '@/store/useAppStore'

export default function PortfolioPage() {
  const wallets = useAppStore((s) => s.wallets)
  const rates = useAppStore((s) => s.rates) ?? mockRates
  const transactions = useAppStore((s) => s.transactions)
  const isLoading = useAppStore((s) => s.isLoading)

  const totalNgn = useMemo(() => totalPortfolioNgn(wallets, rates), [wallets, rates])
  const holdings = useMemo(() => computeHoldings(wallets, rates), [wallets, rates])
  const pnl = useMemo(() => mockPnL(totalNgn), [totalNgn])

  return (
    <main className="min-h-screen pb-20" style={{ backgroundColor: colors.white }}>
      <StatusBar />

      <div className="px-6 pt-2">
        <h1 className="text-[17px] font-bold" style={{ color: colors.ink }}>
          Portfolio
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: `${colors.ink}55` }}>
          Track your assets &amp; performance
        </p>
      </div>

      <div className="mt-3">
        <PortfolioChart totalNgn={totalNgn} />
      </div>

      <div
        className="space-y-6  px-6 pb-5 pt-6 -mt-1"
        style={{ backgroundColor: colors.white }}
      >
        <TotalValue totalNgn={totalNgn} loading={isLoading} />
        <PnLStats stats={pnl} />
        <HoldingsList holdings={holdings} loading={isLoading} />
        <PortfolioTransactions initialTransactions={transactions} />
      </div>

      <BottomNav />
    </main>
  )
}

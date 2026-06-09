'use client'

import { useState } from 'react'
import { AlertSheet } from '@/components/home/AlertSheet'
import { QuickActions } from '@/components/home/QuickActions'
import { RecentActivity } from '@/components/home/RecentActivity'
import { PulseEntryCard } from '@/components/home/PulseEntryCard'
import WalletStack from '@/components/home/WalletStack'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { SimulationBanner } from '@/components/layout/SimulationBanner'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { PullToRefresh } from '@/components/ui/PullToRefresh'
import { ErrorState } from '@/components/ui/ErrorState'
import { mockRates } from '@/lib/mock'
import { useAppStore } from '@/store/useAppStore'

export default function HomePage() {
  const [alertSheetOpen, setAlertSheetOpen] = useState(false)

  const user = useAppStore((s) => s.user)
  const wallets = useAppStore((s) => s.wallets)
  const rates = useAppStore((s) => s.rates)
  const transactions = useAppStore((s) => s.transactions)
  const isLoading = useAppStore((s) => s.isLoading)
  const isRefreshing = useAppStore((s) => s.isRefreshing)
  const error = useAppStore((s) => s.error)
  const refreshAppData = useAppStore((s) => s.refreshAppData)
  const fetchAppData = useAppStore((s) => s.fetchAppData)

  const showError = Boolean(error) && !isLoading

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      <StatusBar />
      <SimulationBanner />

      <PullToRefresh onRefresh={refreshAppData} isRefreshing={isRefreshing}>
        {showError ? (
          <div className="px-6 pt-6">
            <ErrorState message={error!} onRetry={fetchAppData} />
          </div>
        ) : isLoading && !wallets.length ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="px-6">
              <WalletStack
                wallets={wallets}
                rates={rates ?? mockRates}
                kycVerified={user?.kyc_verified}
                onSetAlert={() => setAlertSheetOpen(true)}
              />
            </div>

            <QuickActions wallets={wallets} rates={rates ?? mockRates} />

            <PulseEntryCard />

            <RecentActivity transactions={transactions} />
          </>
        )}
      </PullToRefresh>

      <BottomNav />

      <AlertSheet
        open={alertSheetOpen}
        onClose={() => setAlertSheetOpen(false)}
        rates={rates ?? mockRates}
      />
    </main>
  )
}

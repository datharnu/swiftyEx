'use client'

import { useState } from 'react'
import { AlertSheet } from '@/components/home/AlertSheet'
import { QuickActions } from '@/components/home/QuickActions'
import { RecentActivity } from '@/components/home/RecentActivity'
import WalletStack from '@/components/home/WalletStack'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { Loader } from '@/components/ui/Loader'
import { mockRates } from '@/lib/mock'
import { useAppStore } from '@/store/useAppStore'

export default function HomePage() {
  const [alertSheetOpen, setAlertSheetOpen] = useState(false)

  const user = useAppStore((s) => s.user)
  const wallets = useAppStore((s) => s.wallets)
  const rates = useAppStore((s) => s.rates)
  const transactions = useAppStore((s) => s.transactions)
  const isLoading = useAppStore((s) => s.isLoading)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <StatusBar />

      {isLoading && !wallets.length ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="px-6">
          <WalletStack
            wallets={wallets}
            rates={rates ?? mockRates}
            accountName={user?.first_name}
            onSetAlert={() => setAlertSheetOpen(true)}
          />
          <QuickActions />
        </div>
      )}

      <RecentActivity transactions={transactions} />
      <BottomNav />

      <AlertSheet
        open={alertSheetOpen}
        onClose={() => setAlertSheetOpen(false)}
        rates={rates ?? mockRates}
      />
    </main>
  )
}

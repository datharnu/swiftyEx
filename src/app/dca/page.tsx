'use client'

import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { mockRates } from '@/lib/mock'
import { useAppStore } from '@/store/useAppStore'

export default function DCAPage() {
  const rates = useAppStore((s) => s.rates) ?? mockRates

  void rates

  return (
    <main className="min-h-screen pb-20">
      <StatusBar />
      <div className="p-4">
        <h1 className="font-display text-xl font-semibold text-snow">DCA</h1>
        <p className="mt-1 text-sm text-mist">DCA screen — UI coming soon</p>
      </div>
      <BottomNav />
    </main>
  )
}

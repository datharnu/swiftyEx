'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bell, Plus, Repeat } from 'lucide-react'
import { ActiveAlerts } from '@/components/alerts/ActiveAlerts'
import { AddAlertForm } from '@/components/alerts/AddAlertForm'
import { RatesBanner } from '@/components/home/RatesBanner'
import { ActivePlans } from '@/components/dca/ActivePlans'
import { DCAForm } from '@/components/dca/DCAForm'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { SimulatedBadge } from '@/components/ui/SimulatedBadge'
import { mockRates } from '@/lib/mock'
import { colors } from '@/lib/colors'
import { useAppStore } from '@/store/useAppStore'
import type { Rates } from '@/types'

type Tab = 'alerts' | 'dca'
type Sheet = 'alert' | 'dca' | null

const POLL_INTERVAL = 30_000

export default function ActionsPage() {
  const [tab, setTab] = useState<Tab>('alerts')
  const [sheet, setSheet] = useState<Sheet>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>()
  const [sheetKey, setSheetKey] = useState(0)

  const storeRates = useAppStore((s) => s.rates)
  const fetchRates = useAppStore((s) => s.fetchRates)
  const rates: Rates = storeRates ?? mockRates

  const pollRates = useCallback(async () => {
    await fetchRates()
    setLastUpdated(new Date())
  }, [fetchRates])

  useEffect(() => {
    pollRates()
    const interval = setInterval(pollRates, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [pollRates])

  function openSheet(type: Sheet) {
    setSheetKey((k) => k + 1)
    setSheet(type)
  }

  function closeSheet() {
    setSheet(null)
  }

  const alertCount = useAppStore((s) => s.alerts.filter((a) => a.active).length)
  const planCount = useAppStore((s) => s.dcaPlans.filter((p) => p.active).length)

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: colors.white }}>
      <StatusBar />

      <div className="px-6 pt-2">
        <div className="flex items-center gap-2">
          <h1 className="text-[17px] font-bold" style={{ color: colors.ink }}>
            Actions
          </h1>
          {/* <SimulatedBadge label="Demo alerts & DCA" /> */}
        </div>
        <p className="mt-0.5 text-sm" style={{ color: `${colors.ink}55` }}>
          Live rates above · alerts &amp; DCA plans are simulated locally
        </p>
      </div>

      <div className="mt-4 px-6">
        <RatesBanner
          rates={rates}
          lastUpdated={lastUpdated}
          onSetAlert={() => openSheet('alert')}
          className="mt-0"
        />
      </div>

      <div className="mt-5 px-6">
        <div
          className="flex rounded-2xl p-1"
          style={{ backgroundColor: `${colors.ink}06` }}
        >
          <button
            type="button"
            onClick={() => setTab('alerts')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
            style={
              tab === 'alerts'
                ? { backgroundColor: colors.white, color: colors.ink, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                : { color: `${colors.ink}66` }
            }
          >
            <Bell className="size-4" />
            Alerts
            {alertCount > 0 && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: `${colors.blue}18`, color: colors.blue }}
              >
                {alertCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab('dca')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
            style={
              tab === 'dca'
                ? { backgroundColor: colors.white, color: colors.ink, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
                : { color: `${colors.ink}66` }
            }
          >
            <Repeat className="size-4" />
            DCA
            {planCount > 0 && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: `${colors.gold}44`, color: colors.ink }}
              >
                {planCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-6">
        <div>
          <h2 className="text-[15px] font-bold" style={{ color: colors.ink }}>
            {tab === 'alerts' ? 'Active alerts' : 'Active plans'}
          </h2>
          <p className="text-xs" style={{ color: `${colors.ink}55` }}>
            {tab === 'alerts'
              ? 'Live distance to your targets'
              : 'Progress & next scheduled buy'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openSheet(tab === 'alerts' ? 'alert' : 'dca')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition active:scale-95"
          style={{ backgroundColor: colors.ink }}
          aria-label={tab === 'alerts' ? 'Add alert' : 'Add DCA plan'}
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="mt-4 px-6">
        {tab === 'alerts' ? (
          <ActiveAlerts rates={rates} onAdd={() => openSheet('alert')} />
        ) : (
          <ActivePlans onAdd={() => openSheet('dca')} />
        )}
      </div>

      <BottomNav />

      <BottomSheet open={sheet === 'alert'} onClose={closeSheet}>
        <AddAlertForm
          key={`alert-${sheetKey}`}
          rates={rates}
          onSuccess={closeSheet}
          onClose={closeSheet}
        />
      </BottomSheet>

      <BottomSheet open={sheet === 'dca'} onClose={closeSheet}>
        <DCAForm
          key={`dca-${sheetKey}`}
          onSuccess={closeSheet}
          onClose={closeSheet}
        />
      </BottomSheet>
    </main>
  )
}

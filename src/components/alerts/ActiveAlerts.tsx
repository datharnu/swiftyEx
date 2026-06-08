'use client'

import { AlertAssetIcon } from '@/components/alerts/AlertAssetIcon'
import { Bell, TrendingDown, TrendingUp, X } from 'lucide-react'
import {
  formatAlertAsset,
  formatAlertValue,
  getAlertDistance,
  getLiveRate,
} from '@/lib/actions'
import { colors } from '@/lib/colors'
import { useAppStore } from '@/store/useAppStore'
import type { Rates } from '@/types'

interface ActiveAlertsProps {
  rates: Rates
  onAdd: () => void
}

export function ActiveAlerts({ rates, onAdd }: ActiveAlertsProps) {
  const alerts = useAppStore((s) => s.alerts)
  const removeAlert = useAppStore((s) => s.removeAlert)
  const activeAlerts = alerts.filter((a) => a.active)

  if (activeAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-12 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.blue}14` }}
        >
          <Bell className="size-6" style={{ color: colors.blue }} />
        </div>
        <h3 className="text-[15px] font-bold" style={{ color: colors.ink }}>No active alerts</h3>
        <p className="mt-1.5 max-w-[240px] text-sm" style={{ color: `${colors.ink}66` }}>
          Set a price or NGN rate alert and we&apos;ll notify you when it hits your target.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: colors.ink }}
        >
          Create alert
        </button>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {activeAlerts.map((alert) => {
        const current = getLiveRate(rates, alert)
        const distance = getAlertDistance(alert, current)
        const DirectionIcon = alert.direction === 'above' ? TrendingUp : TrendingDown

        return (
          <li
            key={alert.id}
            className="rounded-2xl border p-4"
            style={{ borderColor: `${colors.ink}0F`, backgroundColor: colors.white }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertAssetIcon alert={alert} size={36} />
                <div>
                  <p className="text-[13.5px] font-semibold" style={{ color: colors.ink }}>
                    {formatAlertAsset(alert)}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: `${colors.ink}66` }}>
                    <DirectionIcon className="size-3" />
                    <span>
                      {alert.direction === 'above' ? 'Above' : 'Below'}{' '}
                      {formatAlertValue(alert, alert.target)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeAlert(alert.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition"
                style={{ backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }}
                aria-label="Remove alert"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
                  Current
                </p>
                <p className="font-mono text-sm font-bold" style={{ color: colors.ink }}>
                  {formatAlertValue(alert, current)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
                  Target
                </p>
                <p className="font-mono text-sm font-bold" style={{ color: colors.teal }}>
                  {formatAlertValue(alert, alert.target)}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: distance.reached ? colors.teal : `${colors.ink}66` }}
                >
                  {distance.label}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: distance.reached ? `${colors.teal}18` : `${colors.blue}14`,
                    color: distance.reached ? colors.teal : colors.blue,
                  }}
                >
                  {distance.reached ? 'Triggered' : 'Watching'}
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full"
                style={{ backgroundColor: `${colors.ink}0D` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${distance.percent}%`,
                    backgroundColor: distance.reached ? colors.teal : colors.blue,
                  }}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

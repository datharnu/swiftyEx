'use client'

import { Calendar, Repeat, X } from 'lucide-react'
import { frequencyLabel, formatNextRun } from '@/lib/actions'
import { colors } from '@/lib/colors'
import { formatNgn } from '@/lib/portfolio'
import { useAppStore } from '@/store/useAppStore'

const ASSET_COLORS: Record<string, string> = {
  BTC: colors.gold,
  ETH: '#627EEA',
  USDT: colors.teal,
}

interface ActivePlansProps {
  onAdd: () => void
}

export function ActivePlans({ onAdd }: ActivePlansProps) {
  const plans = useAppStore((s) => s.dcaPlans)
  const removeDCAPlan = useAppStore((s) => s.removeDCAPlan)
  const activePlans = plans.filter((p) => p.active)

  if (activePlans.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-12 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.gold}22` }}
        >
          <Repeat className="size-6" style={{ color: colors.ink }} />
        </div>
        <h3 className="text-[15px] font-bold" style={{ color: colors.ink }}>No DCA plans yet</h3>
        <p className="mt-1.5 max-w-[240px] text-sm" style={{ color: `${colors.ink}66` }}>
          Automate recurring buys and build your position over time.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{ backgroundColor: colors.ink }}
        >
          Create DCA plan
        </button>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {activePlans.map((plan) => {
        const progress = plan.total_buys > 0
          ? (plan.completed_buys / plan.total_buys) * 100
          : 0
        const assetColor = ASSET_COLORS[plan.asset] ?? colors.blue

        return (
          <li
            key={plan.id}
            className="rounded-2xl border p-4"
            style={{ borderColor: `${colors.ink}0F`, backgroundColor: colors.white }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: assetColor }}
                >
                  {plan.asset.slice(0, 1)}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold" style={{ color: colors.ink }}>
                    {plan.asset} DCA
                  </p>
                  <p className="text-xs" style={{ color: `${colors.ink}66` }}>
                    {formatNgn(plan.amount_ngn)} per buy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${colors.blue}14`, color: colors.blue }}
                >
                  {frequencyLabel(plan.frequency)}
                </span>
                <button
                  type="button"
                  onClick={() => removeDCAPlan(plan.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition"
                  style={{ backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }}
                  aria-label="Remove plan"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: `${colors.ink}66` }}>
                  {plan.completed_buys} of {plan.total_buys} buys
                </span>
                <span className="text-xs font-bold" style={{ color: colors.ink }}>
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full"
                style={{ backgroundColor: `${colors.ink}0D` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: assetColor }}
                />
              </div>
            </div>

            <div
              className="mt-3 flex items-center gap-1.5 text-xs"
              style={{ color: `${colors.ink}66` }}
            >
              <Calendar className="size-3.5" />
              <span>Next run: <span className="font-semibold" style={{ color: colors.ink }}>{formatNextRun(plan.next_run)}</span></span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

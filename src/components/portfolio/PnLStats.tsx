import type { ReactNode } from 'react'
import { SimulatedBadge } from '@/components/ui/SimulatedBadge'
import { colors } from '@/lib/colors'
import type { PnLStats as PnLStatsType } from '@/lib/portfolio'
import { formatNgn } from '@/lib/portfolio'

interface PnLStatsProps {
  stats: PnLStatsType
}

function ProgressRingIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.75" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HistoryIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12a9 9 0 1 0 2.4-6.2"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M3 4v5h5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v5l3 2"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PnLCard({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: ReactNode
}) {
  return (
    <div
      className="flex min-h-[130px] flex-1 flex-col rounded-2xl px-4 py-4"
      style={{ backgroundColor: colors.white, border: `1px solid ${colors.ink}0F` }}
    >
      <p className="text-[15px] font-bold leading-tight" style={{ color: colors.ink }}>
        {title}
      </p>
      <p className="mt-1.5 text-[13px] leading-snug" style={{ color: `${colors.ink}66` }}>
        {subtitle}
      </p>
      <div className="mt-auto pt-6">{icon}</div>
    </div>
  )
}

export function PnLStats({ stats }: PnLStatsProps) {
  const monthPositive = stats.monthChange >= 0
  const allTimePositive = stats.allTimeChange >= 0

  const monthSubtitle = monthPositive
    ? `+${formatNgn(stats.monthChange)} · +${stats.monthPercent.toFixed(1)}% this month`
    : `${formatNgn(stats.monthChange)} · ${stats.monthPercent.toFixed(1)}% this month`

  const allTimeSubtitle = allTimePositive
    ? `+${formatNgn(stats.allTimeChange)} · +${stats.allTimePercent.toFixed(1)}% all time`
    : `${formatNgn(stats.allTimeChange)} · ${stats.allTimePercent.toFixed(1)}% all time`

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-[17px] font-bold" style={{ color: colors.ink }}>
          P&amp;L
        </h2>
        {/* <SimulatedBadge /> */}
      </div>

      <div
        className="flex gap-3 rounded-2xl p-1"
        style={{ backgroundColor: `${colors.ink}06` }}
      >
        <PnLCard
          title="This month"
          subtitle={monthSubtitle}
          icon={<ProgressRingIcon color={monthPositive ? colors.teal : colors.ink} />}
        />
        <PnLCard
          title="All time"
          subtitle={allTimeSubtitle}
          icon={<HistoryIcon color={allTimePositive ? colors.gold : colors.ink} />}
        />
      </div>
    </div>
  )
}

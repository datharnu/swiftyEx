'use client'

import type { ReactNode } from 'react'
import type { Rates } from '@/types'
import statBg from '../../public/Stat.png'
import { Bell } from 'lucide-react'

type RateAsset = keyof Rates

interface RatesBannerProps {
  rates?: Rates
  asset?: RateAsset
  onSetAlert?: () => void
  lastUpdated?: Date
  className?: string
}

function formatRate(value: string) {
  const num = Number(value.replace(/,/g, ''))
  if (Number.isNaN(num)) return '₦ 0'
  return `₦ ${num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function BuyRateIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M7 14l5 5 5-5" stroke="#32C98B" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SellRateIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 19V5M7 10l5-5 5 5" stroke="#E85C6A" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RateColumn({ icon, label, value }: {
  icon: ReactNode; label: string; value: string
}) {
  return (
    <div className="flex flex-1 items-center gap-3 px-5 sm:px-6">
      {icon}
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
          {value}
        </p>
      </div>
    </div>
  )
}

export function RatesBanner({
  rates,
  asset = 'USDT',
  onSetAlert,
  lastUpdated,
  className = '',
}: RatesBannerProps) {
  const pair = rates?.[asset] ?? { buy: '1430.00', sell: '1340.00' }

  return (
    <div
      className={`relative mt-2 w-full overflow-hidden rounded-xl ${className}`}
      style={{
        backgroundImage: `url(${statBg.src})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {lastUpdated && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-white/90">
            Live
          </span>
          <span className="text-[10px] text-white/50">
            {lastUpdated.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      <div className={`flex items-center pt-4 ${onSetAlert ? 'pb-3' : 'pb-4'}`}>
        <RateColumn icon={<BuyRateIcon />} label="Buy Rate" value={formatRate(pair.buy)} />
        <div className="h-[55%] w-px shrink-0 bg-white/25" aria-hidden />
        <RateColumn icon={<SellRateIcon />} label="Sell Rate" value={formatRate(pair.sell)} />
      </div>

      {onSetAlert && (
        <button
          type="button"
          onClick={onSetAlert}
          className="mx-3 mb-3 flex w-[calc(100%-24px)] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 py-2.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/14 hover:text-white active:scale-[0.98]"
        >
          <Bell size={17} />
          Set Rate Alert
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
        </button>
      )}
    </div>
  )
}
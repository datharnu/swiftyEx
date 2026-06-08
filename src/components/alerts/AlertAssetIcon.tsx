'use client'

import { AssetIcon, AssetIconBadge } from '@/components/ui/AssetIcon'
import type { PriceAlert } from '@/types'

/** Primary icon asset key for an alert row */
export function getAlertIconAssets(alert: PriceAlert): string[] {
  if (alert.type === 'naira_rate') return ['USD']
  const base = alert.asset.split('/')[0].trim()
  if (base === 'BTC') return ['BTC']
  if (base === 'ETH') return ['ETH']
  return [base]
}

interface AlertAssetIconProps {
  alert: PriceAlert
  size?: number
}

export function AlertAssetIcon({ alert, size = 36 }: AlertAssetIconProps) {
  const assets = getAlertIconAssets(alert)

  if (assets.length === 2) {
    const iconSize = Math.round(size * 0.42)
    return (
      <div
        className="relative flex shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-zinc-100"
        style={{ width: size, height: size }}
      >
        <AssetIcon
          asset={assets[0]}
          size={iconSize}
          className="absolute -left-0.5 top-1/2 -translate-y-1/2 ring-2 ring-white"
        />
        <AssetIcon
          asset={assets[1]}
          size={iconSize}
          className="absolute -right-0.5 top-1/2 -translate-y-1/2 ring-2 ring-white"
        />
      </div>
    )
  }

  return (
    <AssetIconBadge
      asset={assets[0]}
      size={size}
      bgClassName="bg-white ring-1 ring-zinc-100"
    />
  )
}

interface AlertAssetOptionProps {
  assets: string[]
  label: string
  selected: boolean
  onClick: () => void
}

/** Chip picker used in AddAlertForm */
export function AlertAssetOption({ assets, label, selected, onClick }: AlertAssetOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition active:scale-[0.98] ${
        selected
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
      }`}
    >
      <span className="flex items-center -space-x-1">
        {assets.map((asset) => (
          <AssetIcon
            key={asset}
            asset={asset}
            size={20}
            className={`ring-2 ${selected ? 'ring-zinc-900' : 'ring-white'}`}
          />
        ))}
      </span>
      <span className="truncate">{label}</span>
    </button>
  )
}

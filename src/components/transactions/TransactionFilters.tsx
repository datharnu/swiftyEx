'use client'

import { AssetIcon } from '@/components/ui/AssetIcon'
import { walletTypeToAssetId } from '@/lib/assets'
import type { WalletType } from '@/types'

export type TransactionFilter = 'all' | WalletType

const FILTERS: { id: TransactionFilter; label: string; asset?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'naira', label: 'Naira', asset: 'NGN' },
  { id: 'usdt', label: 'USDT', asset: 'USDT' },
  { id: 'usd', label: 'USD', asset: 'USD' },
  { id: 'btc', label: 'BTC', asset: 'BTC' },
]

interface TransactionFiltersProps {
  value: TransactionFilter
  onChange: (filter: TransactionFilter) => void
}

export function TransactionFilters({ value, onChange }: TransactionFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTERS.map((filter) => {
        const active = value === filter.id
        const asset = filter.asset ?? (filter.id !== 'all' ? walletTypeToAssetId(filter.id) : undefined)

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 ${
              active
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {asset && <AssetIcon asset={asset} size={16} />}
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

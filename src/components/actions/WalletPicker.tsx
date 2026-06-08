'use client'

import { AssetIcon } from '@/components/ui/AssetIcon'
import { getWalletLabel, walletTypeToAssetId } from '@/lib/assets'
import type { Wallet, WalletType } from '@/types'

interface WalletPickerProps {
  wallets: Wallet[]
  value: WalletType
  onChange: (type: WalletType) => void
  exclude?: WalletType[]
}

export function WalletPicker({ wallets, value, onChange, exclude = [] }: WalletPickerProps) {
  const options = wallets.filter((w) => !exclude.includes(w.wallet_type))

  if (options.length === 0) {
    return (
      <p className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
        No wallets available.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((wallet) => {
        const active = value === wallet.wallet_type
        const label = getWalletLabel(wallet.wallet_type)

        return (
          <button
            key={wallet.wallet_type}
            type="button"
            onClick={() => onChange(wallet.wallet_type)}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition active:scale-95 ${
              active
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
            }`}
          >
            <AssetIcon
              asset={walletTypeToAssetId(wallet.wallet_type)}
              size={20}
              className={active ? 'ring-1 ring-white/20' : ''}
            />
            {label}
          </button>
        )
      })}
    </div>
  )
}


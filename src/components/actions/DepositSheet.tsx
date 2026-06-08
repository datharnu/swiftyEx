'use client'

import { useState } from 'react'
import { ArrowDownLeft } from 'lucide-react'
import { WalletPicker } from './WalletPicker'
import { getWalletLabel } from '@/lib/assets'
import { DepositAddress } from '@/components/wallet/DepositAddress'
import { openBotAction } from '@/lib/bot'
import type { Wallet, WalletType } from '@/types'

interface DepositSheetProps {
  wallets: Wallet[]
  onClose: () => void
}

export function DepositSheet({ wallets, onClose }: DepositSheetProps) {
  const [selected, setSelected] = useState<WalletType>(
    wallets[0]?.wallet_type ?? 'usdt',
  )

  const wallet = wallets.find((w) => w.wallet_type === selected) ?? null
  const isNaira = selected === 'naira'

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ArrowDownLeft className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Deposit funds</h2>
          <p className="text-sm text-zinc-400">Add money to your wallet</p>
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Select wallet
      </p>
      <WalletPicker wallets={wallets} value={selected} onChange={setSelected} />

      <div className="mt-5">
        {isNaira ? (
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-800">Naira bank deposit</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Naira deposits are processed via bank transfer. Continue in the bot to get your
              dedicated account details.
            </p>
            <button
              type="button"
              onClick={() => openBotAction('deposit', { wallet: 'naira' })}
              className="mt-4 w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              Get bank details
            </button>
          </div>
        ) : (
          <DepositAddress wallet={wallet} walletLabel={getWalletLabel(selected)} />
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50"
      >
        Done
      </button>
    </div>
  )
}

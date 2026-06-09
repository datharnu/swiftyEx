'use client'

import { QrCode } from 'lucide-react'
import { CopyButton } from '@/components/ui/CopyButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { truncateAddress } from '@/lib/format'
import type { Wallet } from '@/types'

interface DepositAddressProps {
  wallet: Wallet | null
  walletLabel: string
}

export function DepositAddress({ wallet, walletLabel }: DepositAddressProps) {
  const address = wallet?.deposit_address

  if (!address) {
    return (
      <EmptyState
        icon={<QrCode className="size-6" />}
        title="No deposit address yet"
        description={`Your ${walletLabel} deposit address will appear here once your wallet is ready.`}
      />
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-200/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Deposit address
          </p>
          {wallet?.blockchain && (
            <p className="mt-0.5 text-xs text-zinc-500">
              Network: <span className="font-medium capitalize text-zinc-700">{wallet.blockchain}</span>
            </p>
          )}
        </div>
        <CopyButton text={address} variant="icon" label="Copy address" />
      </div>

      <p className="mt-3 break-all rounded-xl bg-white px-3 py-2.5 font-mono text-xs leading-relaxed text-zinc-800">
        {address}
      </p>

      <p className="mt-2 text-center text-[11px] text-zinc-400">
        {truncateAddress(address, 10)} · Tap copy to share
      </p>
    </div>
  )
}

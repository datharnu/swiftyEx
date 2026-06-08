'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { WalletPicker } from './WalletPicker'
import { getWalletSymbol } from '@/lib/assets'
import { openBotAction } from '@/lib/bot'
import { formatBalance, parseBalance } from '@/lib/format'
import type { Wallet, WalletType } from '@/types'

interface WithdrawSheetProps {
  wallets: Wallet[]
  onClose: () => void
}

export function WithdrawSheet({ wallets, onClose }: WithdrawSheetProps) {
  const [walletType, setWalletType] = useState<WalletType>(
    wallets[0]?.wallet_type ?? 'usdt',
  )
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')

  const wallet = wallets.find((w) => w.wallet_type === walletType)
  const balance = parseBalance(wallet?.balance)
  const isNaira = walletType === 'naira'
  const isCrypto = walletType === 'usdt' || walletType === 'btc' || walletType === 'ethereum'

  const amountNum = parseBalance(amount)
  const isValid =
    amountNum > 0 &&
    amountNum <= balance &&
    (isNaira ? destination.length >= 10 : isCrypto ? destination.length >= 20 : destination.length > 0)

  const maxAmount = useMemo(() => formatBalance(balance, { isCrypto }), [balance, isCrypto])

  function handleMax() {
    setAmount(maxAmount.replace(/,/g, ''))
  }

  function handleSubmit() {
    if (!isValid) return
    openBotAction('withdraw', {
      wallet: walletType,
      amount: amount.replace(/,/g, ''),
      dest: destination.slice(0, 20),
    })
    onClose()
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
          <ArrowUpRight className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Withdraw</h2>
          <p className="text-sm text-zinc-400">Send funds to your account</p>
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        From wallet
      </p>
      <WalletPicker wallets={wallets} value={walletType} onChange={setWalletType} />

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor="withdraw-amount" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Amount
          </label>
          <button
            type="button"
            onClick={handleMax}
            className="text-xs font-semibold text-blue-600"
          >
            Max: {getWalletSymbol(walletType)}{maxAmount}
          </button>
        </div>
        <input
          id="withdraw-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          placeholder="0.00"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white"
        />
        {amountNum > balance && (
          <p className="mt-1 text-xs text-rose-500">Insufficient balance</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="withdraw-dest" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          {isNaira ? 'Bank account number' : isCrypto ? 'Destination address' : 'Destination'}
        </label>
        <input
          id="withdraw-dest"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder={isNaira ? '0123456789' : isCrypto ? 'Wallet address' : 'Enter destination'}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid}
        className="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
      >
        Continue in Telegram
      </button>

      <p className="mt-3 text-center text-[11px] text-zinc-400">
        Withdrawals are completed securely via the SwiftyEx bot
      </p>
    </div>
  )
}

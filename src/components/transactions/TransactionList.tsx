import type { Transaction } from '@/types'

export const TRANSACTION_PREVIEW_LIMIT = 4

export function formatTransactionDate(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  if (date >= startOfToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  if (date >= startOfYesterday) {
    return 'Yesterday'
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatAmount(type: Transaction['type'], amountNgn: string) {
  const value = Number(amountNgn.replace(/,/g, ''))
  const formatted = `₦${value.toLocaleString('en-US')}`
  const isOutgoing = type === 'buy' || type === 'withdrawal'
  return isOutgoing ? `-${formatted}` : `+${formatted}`
}

function transactionTitle(tx: Transaction) {
  const label = tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
  return `${label} ${tx.asset}`
}

function transactionCategory(tx: Transaction) {
  if (tx.is_dca) return 'DCA'
  const labels: Record<Transaction['type'], string> = {
    buy: 'Purchase',
    sell: 'Sale',
    swap: 'Exchange',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
  }
  return labels[tx.type]
}

function AssetIcon({ asset }: { asset: string }) {
  const key = asset.toUpperCase()

  if (key === 'BTC') {
    return (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="16" fill="#F7931A" />
        <path
          d="M18.5 14.5c.3-2-1.2-3-3.3-3.7l.7-2.7-1.6-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.7-1.6-.4-.7 2.7c-.3-.1-.7-.1-1-.2l-2.2-.6-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 .1.1.2.2.2h-.2l-1.1 4.5c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.1.5c.4.1.8.2 1.2.3l-.7 2.8 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.8c2.9.5 5.1.3 6-2.3.7-2-.1-3.2-1.5-4 1.1-.3 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2.1-4 .9-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.4c-.5 1.9-3.5.9-4.5.7l.8-3.3c1 .3 4.2.7 3.7 2.6z"
          fill="white"
        />
      </svg>
    )
  }

  if (key === 'USDT') {
    return (
      <span className="text-sm font-bold text-white" aria-hidden>
        ₮
      </span>
    )
  }

  if (key === 'ETH') {
    return (
      <svg width="14" height="22" viewBox="0 0 16 26" fill="none" aria-hidden>
        <path d="M8 0L8.2 0.7V17.5L8 17.7L0 13.5L8 0Z" fill="white" fillOpacity="0.6" />
        <path d="M8 0L16 13.5L8 17.7V0Z" fill="white" />
        <path d="M8 19.2L8.2 19V22.8L8 23.6L0 14.8L8 19.2Z" fill="white" fillOpacity="0.6" />
        <path d="M8 23.6V19.2L16 14.8L8 23.6Z" fill="white" />
      </svg>
    )
  }

  return (
    <span className="text-xs font-bold text-white" aria-hidden>
      {asset.slice(0, 3)}
    </span>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const iconBg =
    tx.asset.toUpperCase() === 'USDT'
      ? 'bg-[#1a1a1a]'
      : tx.asset.toUpperCase() === 'BTC'
        ? 'bg-[#1a1a1a]'
        : 'bg-gradient-to-br from-zinc-500 to-zinc-700'

  return (
    <li className="flex items-center gap-3.5 py-4">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <AssetIcon asset={tx.asset} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-zinc-900">{transactionTitle(tx)}</p>
        <p className="text-xs text-zinc-400">{transactionCategory(tx)}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[13.5px] font-semibold text-zinc-900">{formatAmount(tx.type, tx.amount_ngn)}</p>
        <p className="text-xs text-zinc-400">{formatTransactionDate(tx.date)}</p>
      </div>
    </li>
  )
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="py-8 text-center text-sm text-zinc-400">No transactions yet</p>
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} />
      ))}
    </ul>
  )
}

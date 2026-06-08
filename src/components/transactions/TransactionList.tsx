'use client'

import { motion } from 'framer-motion'
import { ArrowLeftRight, Clock } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { AssetIconBadge } from '@/components/ui/AssetIcon'
import type { Transaction, TransactionStatus } from '@/types'

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

export function formatGroupDate(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  if (date >= startOfToday) return 'Today'
  if (date >= startOfYesterday) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
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

const STATUS_STYLES: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Completed' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Processing' },
  failed: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Failed' },
}

function StatusBadge({ status }: { status?: TransactionStatus }) {
  const style = STATUS_STYLES[status ?? 'completed']
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}

function TransactionRow({ tx, index }: { tx: Transaction; index: number }) {
  const amountColor =
    tx.type === 'buy' || tx.type === 'withdrawal' ? 'text-zinc-900' : 'text-emerald-600'

  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-3.5 py-4"
    >
      <AssetIconBadge asset={tx.asset} size={40} bgClassName="bg-white ring-1 ring-zinc-100" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13.5px] font-semibold text-zinc-900">{transactionTitle(tx)}</p>
          <StatusBadge status={tx.status} />
        </div>
        <p className="text-xs text-zinc-400">{transactionCategory(tx)}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className={`text-[13.5px] font-semibold ${amountColor}`}>
          {formatAmount(tx.type, tx.amount_ngn)}
        </p>
        <p className="text-xs text-zinc-400">{formatTransactionDate(tx.date)}</p>
      </div>
    </motion.li>
  )
}

export function groupTransactionsByDate(transactions: Transaction[]) {
  const groups = new Map<string, Transaction[]>()

  for (const tx of transactions) {
    const key = formatGroupDate(tx.date)
    const list = groups.get(key) ?? []
    list.push(tx)
    groups.set(key, list)
  }

  return Array.from(groups.entries())
}

interface TransactionListProps {
  transactions: Transaction[]
  grouped?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function TransactionList({
  transactions,
  grouped = false,
  emptyTitle = 'No transactions yet',
  emptyDescription = 'Your buy, sell, and deposit activity will show up here once you start trading.',
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<ArrowLeftRight className="size-6" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  if (!grouped) {
    return (
      <ul className="divide-y divide-zinc-100">
        {transactions.map((tx, i) => (
          <TransactionRow key={tx.id} tx={tx} index={i} />
        ))}
      </ul>
    )
  }

  const groups = groupTransactionsByDate(transactions)

  return (
    <div className="space-y-2">
      {groups.map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <div className="sticky top-14 z-10 flex items-center gap-2 bg-white/95 py-2 backdrop-blur-sm">
            <Clock className="size-3.5 text-zinc-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {dateLabel}
            </p>
          </div>
          <ul className="divide-y divide-zinc-100">
            {items.map((tx, i) => (
              <TransactionRow key={tx.id} tx={tx} index={i} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

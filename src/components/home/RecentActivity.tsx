'use client'

import Link from 'next/link'
import type { Transaction } from '@/types'
import {
  TRANSACTION_PREVIEW_LIMIT,
  TransactionList,
} from '@/components/transactions/TransactionList'

interface RecentActivityProps {
  transactions?: Transaction[]
}

export function RecentActivity({ transactions = [] }: RecentActivityProps) {
  const preview = transactions.slice(0, TRANSACTION_PREVIEW_LIMIT)
  const remaining = transactions.length - preview.length

  return (
    <section className="mt-6 rounded-t-[28px] bg-white px-6 pb-32 pt-5">
      <Link
        href="/transactions"
        className="flex items-center gap-1 text-[17px] font-bold text-zinc-900"
      >
        Transactions
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="mt-1">
  {preview.length === 0 ? (
    <div className="py-8 text-center text-sm text-zinc-400">
      No transactions yet
    </div>
  ) : (
    <TransactionList transactions={preview} />
  )}
</div>

      {remaining > 0 && (
        <Link
          href="/transactions"
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.99]"
        >
          View all {transactions.length} transactions
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </section>
  )
}

'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

  return (
    <section className="mt-4 rounded-t-[28px] bg-white px-6 pb-32 pt-5 shadow-[0_-8px_32px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-[17px] font-bold text-zinc-900"
        >
          Recent activity
          <ArrowRight className="size-4" />
        </Link>
        {transactions.length > 0 && (
          <span className="text-xs font-medium text-zinc-400">
            {transactions.length} total
          </span>
        )}
      </div>

      <div className="mt-2">
        <TransactionList
          transactions={preview}
          emptyDescription="Make your first trade or deposit to see activity here."
        />
      </div>

      {transactions.length > TRANSACTION_PREVIEW_LIMIT && (
        <Link
          href="/transactions"
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.99]"
        >
          View all {transactions.length} transactions
          <ArrowRight className="size-4" />
        </Link>
      )}
    </section>
  )
}

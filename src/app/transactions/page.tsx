'use client'

import { useCallback, useEffect, useState } from 'react'
import { TransactionList } from '@/components/transactions/TransactionList'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { Loader } from '@/components/ui/Loader'
import { TRANSACTIONS_PAGE_SIZE } from '@/lib/api'
import { useAppStore } from '@/store/useAppStore'
import type { Transaction } from '@/types'

export default function TransactionsPage() {
  const fetchTransactions = useAppStore((s) => s.fetchTransactions)
  const initialTransactions = useAppStore((s) => s.transactions)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      if (nextPage === 1) setLoading(true)
      else setLoadingMore(true)

      try {
        const data = await fetchTransactions(nextPage, '')
        setTransactions((prev) => (replace ? data : [...prev, ...data]))
        setHasMore(data.length >= TRANSACTIONS_PAGE_SIZE)
        setPage(nextPage)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [fetchTransactions],
  )

  useEffect(() => {
    if (initialTransactions.length) {
      setTransactions(initialTransactions)
      setHasMore(initialTransactions.length >= TRANSACTIONS_PAGE_SIZE)
      setLoading(false)
      return
    }
    loadPage(1, true)
  }, [initialTransactions, loadPage])

  return (
    <main className="min-h-screen bg-white">
      <StatusBar />
      <div className="px-6 pb-32 pt-2">
        <h1 className="text-[17px] font-bold text-zinc-900">All Transactions</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {loading ? 'Loading…' : `${transactions.length} loaded`}
        </p>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="mt-4">
            <TransactionList transactions={transactions} />
          </div>
        )}

        {hasMore && !loading && (
          <button
            type="button"
            onClick={() => loadPage(page + 1)}
            disabled={loadingMore}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.99] disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
      <BottomNav />
    </main>
  )
}

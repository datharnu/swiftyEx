'use client'

import { useCallback, useEffect, useState } from 'react'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters, type TransactionFilter } from '@/components/transactions/TransactionFilters'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { PullToRefresh } from '@/components/ui/PullToRefresh'
import { TransactionListSkeleton } from '@/components/ui/Skeleton'
import { useAppStore } from '@/store/useAppStore'
import type { Transaction } from '@/types'

export default function TransactionsPage() {
  const fetchTransactions = useAppStore((s) => s.fetchTransactions)
  const refreshAppData = useAppStore((s) => s.refreshAppData)
  const isRefreshing = useAppStore((s) => s.isRefreshing)
  const transactionCount = useAppStore((s) => s.transactionCount)
  const initialTransactions = useAppStore((s) => s.transactions)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<TransactionFilter>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [count, setCount] = useState(0)

  const walletType = filter === 'all' ? '' : filter

  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      if (nextPage === 1) setLoading(true)
      else setLoadingMore(true)

      try {
        const data = await fetchTransactions(nextPage, walletType)
        setTransactions((prev) => (replace ? data.transactions : [...prev, ...data.transactions]))
        setHasMore(data.has_next)
        setCount(data.count)
        setPage(nextPage)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [fetchTransactions, walletType],
  )

  useEffect(() => {
    if (filter === 'all' && initialTransactions.length) {
      setTransactions(initialTransactions)
      setCount(transactionCount)
      setHasMore(initialTransactions.length >= 20)
      setLoading(false)
      return
    }
    loadPage(1, true)
  }, [filter, initialTransactions, transactionCount, loadPage])

  const handleFilterChange = (next: TransactionFilter) => {
    setFilter(next)
    setPage(1)
  }

  const handleRefresh = async () => {
    await refreshAppData()
    await loadPage(1, true)
  }

  return (
    <main className="min-h-screen bg-white">
      <StatusBar />

      <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
        <div className="px-6 pb-32 pt-2">
          <h1 className="text-[17px] font-bold text-zinc-900">Transactions</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {loading ? 'Loading…' : count > 0 ? `${count} transactions` : 'No activity yet'}
          </p>

          <div className="mt-4">
            <TransactionFilters value={filter} onChange={handleFilterChange} />
          </div>

          {loading ? (
            <div className="mt-6">
              <TransactionListSkeleton />
            </div>
          ) : (
            <div className="mt-4">
              <TransactionList transactions={transactions} grouped />
            </div>
          )}

          {hasMore && !loading && transactions.length > 0 && (
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
      </PullToRefresh>

      <BottomNav />
    </main>
  )
}

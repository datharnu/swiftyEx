'use client'

import { useCallback, useEffect, useState } from 'react'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TRANSACTIONS_PAGE_SIZE } from '@/lib/api'
import { colors } from '@/lib/colors'
import { useAppStore } from '@/store/useAppStore'
import type { Transaction } from '@/types'

const FILTERS = [
  { id: '', label: 'All' },
  { id: 'btc', label: 'BTC' },
  { id: 'usdt', label: 'USD' },
  { id: 'naira', label: 'Naira' },
] as const

interface PortfolioTransactionsProps {
  initialTransactions: Transaction[]
}

export function PortfolioTransactions({ initialTransactions }: PortfolioTransactionsProps) {
  const fetchTransactions = useAppStore((s) => s.fetchTransactions)

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialTransactions.length >= TRANSACTIONS_PAGE_SIZE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTransactions(initialTransactions)
    setHasMore(initialTransactions.length >= TRANSACTIONS_PAGE_SIZE)
    setPage(1)
    setFilter('')
  }, [initialTransactions])

  const loadPage = useCallback(
    async (nextPage: number, walletType: string, replace = false) => {
      setLoading(true)
      try {
        const data = await fetchTransactions(nextPage, walletType)
        setTransactions((prev) => (replace ? data.transactions : [...prev, ...data.transactions]))
        setHasMore(data.has_next)
        setPage(nextPage)
      } finally {
        setLoading(false)
      }
    },
    [fetchTransactions],
  )

  const handleFilter = (walletType: string) => {
    setFilter(walletType)
    loadPage(1, walletType, true)
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) loadPage(page + 1, filter)
  }

  return (
    <div>
      <h2 className="text-[17px] font-bold" style={{ color: colors.ink }}>
        Transactions
      </h2>
      <p className="mt-0.5 text-sm" style={{ color: `${colors.ink}55` }}>
        {transactions.length} loaded
      </p>

      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id || 'all'}
              type="button"
              onClick={() => handleFilter(f.id)}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
              style={{
                backgroundColor: active ? colors.ink : `${colors.ink}0D`,
                color: active ? colors.white : `${colors.ink}99`,
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <div className="mt-2">
        <TransactionList transactions={transactions} />
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border py-3 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50"
          style={{
            borderColor: `${colors.ink}1A`,
            color: colors.ink,
            backgroundColor: colors.white,
          }}
        >
          {loading ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  )
}

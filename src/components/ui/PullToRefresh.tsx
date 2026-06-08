'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import { Loader } from './Loader'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  isRefreshing?: boolean
  children: ReactNode
  className?: string
}

const THRESHOLD = 72

export function PullToRefresh({
  onRefresh,
  isRefreshing = false,
  children,
  className = '',
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const pulling = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return
    startY.current = e.touches[0].clientY
    pulling.current = true
  }, [isRefreshing])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || isRefreshing) return
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.45, THRESHOLD + 20))
    }
  }, [isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return
    pulling.current = false

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      await onRefresh()
    }
    setPullDistance(0)
  }, [pullDistance, isRefreshing, onRefresh])

  const progress = Math.min(pullDistance / THRESHOLD, 1)

  return (
    <div
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-end justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: isRefreshing ? 48 : pullDistance }}
      >
        <div
          className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-400"
          style={{ opacity: isRefreshing ? 1 : progress }}
        >
          {isRefreshing ? (
            <>
              <Loader className="h-4 w-4 border-zinc-300 border-t-zinc-600" />
              Refreshing…
            </>
          ) : (
            <span>{progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}</span>
          )}
        </div>
      </div>

      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${isRefreshing ? 12 : pullDistance > 0 ? pullDistance * 0.3 : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const fetchAppData = useAppStore((s) => s.fetchAppData)
  const isInitialized = useAppStore((s) => s.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      fetchAppData()
    }
  }, [fetchAppData, isInitialized])

  return children
}

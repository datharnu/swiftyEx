'use client'

import { useEffect, useState } from 'react'
import { getTelegramWebApp, initTelegramApp } from '@/lib/telegram'
import type { TelegramUser } from '@/types'

export const useTelegram = () => {
  const [tg, setTg] = useState<ReturnType<typeof getTelegramWebApp>>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [initData, setInitData] = useState<string>('')

  useEffect(() => {
    const webApp = getTelegramWebApp()
    if (webApp) {
      initTelegramApp()
      setTg(webApp)
      setUser(webApp.initDataUnsafe?.user ?? null)
      setInitData(webApp.initData ?? '')
    }
  }, [])

  return { tg, user, initData }
}

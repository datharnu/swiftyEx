'use client'

import { useTelegram } from './useTelegram'

export const useInitData = () => {
  const { initData } = useTelegram()
  // In dev/debug mode returns empty string which hits their debug bypass
  // In production returns real Telegram initData
  return initData
}

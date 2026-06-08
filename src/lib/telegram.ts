export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined') {
    return window.Telegram?.WebApp ?? null
  }
  return null
}

export const getInitData = (): string => {
  const tg = getTelegramWebApp()
  return tg?.initData ?? ''
}

export const initTelegramApp = () => {
  const tg = getTelegramWebApp()
  if (tg) {
    tg.ready()
    tg.expand()
  }
}

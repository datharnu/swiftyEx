interface TelegramWebAppUser {
  id: number
  first_name: string
  username?: string
  language_code?: string
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramWebAppUser
  }
  ready: () => void
  expand: () => void
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
  }
  openTelegramLink?: (url: string) => void
}

interface Telegram {
  WebApp: TelegramWebApp
}

interface Window {
  Telegram?: Telegram
}

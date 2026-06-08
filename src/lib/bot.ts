import { getTelegramWebApp } from './telegram'

export type BotAction = 'deposit' | 'withdraw' | 'swap' | 'otc' | 'kyc'

export function getBotUsername(): string {
  return process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'SwiftyEXBot'
}

/** Build a t.me deep-link start payload for the Telegram bot */
export function buildBotStartLink(action: BotAction, params?: Record<string, string>): string {
  const bot = getBotUsername()
  const payload = params
    ? `${action}_${Object.values(params).join('_')}`
    : action
  return `https://t.me/${bot}?start=${encodeURIComponent(payload)}`
}

export function openBotLink(url: string): void {
  const tg = getTelegramWebApp()
  tg?.HapticFeedback?.impactOccurred('medium')

  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url)
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openBotAction(action: BotAction, params?: Record<string, string>): void {
  openBotLink(buildBotStartLink(action, params))
}

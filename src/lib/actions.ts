import type { PriceAlert, Rates } from '@/types'

export function getLiveRate(rates: Rates, alert: PriceAlert): number {
  if (alert.type === 'naira_rate') {
    return Number(rates.USDT.buy)
  }
  const key = alert.asset.split('/')[0].trim() as keyof Rates
  return Number(rates[key]?.buy ?? 0)
}

export function getAlertDistance(alert: PriceAlert, current: number) {
  const { target, direction } = alert

  if (direction === 'above') {
    if (current >= target) {
      return { percent: 100, label: 'Target reached', reached: true }
    }
    const range = target - current
    const total = target
    const percent = Math.max(0, Math.min(100, ((total - range) / total) * 100))
    const diff = target - current
    const pctAway = ((diff / target) * 100).toFixed(1)
    return { percent, label: `${pctAway}% to go`, reached: false }
  }

  if (current <= target) {
    return { percent: 100, label: 'Target reached', reached: true }
  }
  const diff = current - target
  const pctAway = ((diff / current) * 100).toFixed(1)
  const percent = Math.max(0, Math.min(100, (target / current) * 100))
  return { percent, label: `${pctAway}% to go`, reached: false }
}

export function formatAlertValue(alert: PriceAlert, value: number): string {
  if (alert.type === 'naira_rate') {
    return `₦${value.toLocaleString('en-NG')}`
  }
  return `$${value.toLocaleString('en-US')}`
}

export function formatAlertAsset(alert: PriceAlert): string {
  if (alert.type === 'naira_rate') return 'USD / NGN'
  return alert.asset
}

export function formatNextRun(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function frequencyLabel(freq: 'daily' | 'weekly' | 'monthly'): string {
  return { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }[freq]
}

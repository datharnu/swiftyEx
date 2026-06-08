/** Parse API balance strings including scientific notation (e.g. "0E-8") */
export function parseBalance(value: string | null | undefined): number {
  if (!value) return 0
  const cleaned = value.replace(/,/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}

export function formatBalance(
  value: string | number,
  options: { isCrypto?: boolean; currency?: string } = {},
) {
  const { isCrypto = false, currency } = options
  const num = typeof value === 'string' ? parseBalance(value) : value

  if (isCrypto) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })
  }

  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return currency ? `${currency}${formatted}` : formatted
}

export function formatNgn(value: number, compact = false) {
  if (compact && value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(2)}M`
  }
  return `₦${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function truncateAddress(address: string, chars = 6) {
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}…${address.slice(-chars)}`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

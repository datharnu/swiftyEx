/** On by default for hackathon — set NEXT_PUBLIC_API_DEBUG=false to hide in production */
export const isApiDebugEnabled = process.env.NEXT_PUBLIC_API_DEBUG !== 'false'

export const API_ENDPOINTS = [
  { id: 'me', method: 'POST', path: '/miniapp/me', label: 'Me' },
  { id: 'wallets', method: 'POST', path: '/miniapp/wallets', label: 'Wallets' },
  { id: 'transactions', method: 'POST', path: '/miniapp/transactions', label: 'Transactions' },
  { id: 'rates', method: 'GET', path: '/miniapp/rates', label: 'Rates' },
] as const

export type ApiEndpointId = (typeof API_ENDPOINTS)[number]['id']

export function endpointIdFromUrl(url: string): ApiEndpointId | null {
  const match = API_ENDPOINTS.find((e) => url.includes(e.path))
  return match?.id ?? null
}

export function previewInitData(initData: string): string {
  if (!initData) return '(empty — local debug bypass or not in Telegram)'
  if (initData.length <= 24) return initData
  return `${initData.slice(0, 12)}…${initData.slice(-8)} (${initData.length} chars)`
}

export function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export function fullApiUrl(path: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

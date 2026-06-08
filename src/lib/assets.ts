export type AssetId = 'BTC' | 'ETH' | 'USDT' | 'USD' | 'NGN' | 'NAIRA'

const ICON_MAP: Record<string, string> = {
  BTC: '/icons/btc.svg',
  BITCOIN: '/icons/btc.svg',
  ETH: '/icons/eth.svg',
  ETHEREUM: '/icons/eth.svg',
  USDT: '/icons/usdt.svg',
  TETHER: '/icons/usdt.svg',
  USD: '/icons/usd.svg',
  NGN: '/icons/ngn.svg',
  NAIRA: '/icons/ngn.svg',
}

const LABEL_MAP: Record<string, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'Tether',
  USD: 'US Dollar',
  NGN: 'Naira',
  NAIRA: 'Naira',
}

/** Normalize wallet types, asset strings, and holding ids to a canonical asset key */
export function normalizeAssetId(value: string): string {
  const key = value.trim().toUpperCase()

  if (key === 'NAIRA' || key === 'NGN') return 'NGN'
  if (key === 'ETHEREUM') return 'ETH'
  if (key === 'BITCOIN') return 'BTC'

  return key
}

export function getAssetIcon(asset: string): string {
  const id = normalizeAssetId(asset)
  return ICON_MAP[id] ?? ICON_MAP.USDT
}

export function getAssetLabel(asset: string): string {
  const id = normalizeAssetId(asset)
  return LABEL_MAP[id] ?? asset
}

export function walletTypeToAssetId(walletType: string): string {
  if (walletType === 'naira') return 'NGN'
  if (walletType === 'ethereum') return 'ETH'
  if (walletType === 'usdt') return 'USDT'
  if (walletType === 'usd') return 'USD'
  if (walletType === 'btc') return 'BTC'
  return walletType.toUpperCase()
}

export function getWalletLabel(walletType: string): string {
  const labels: Record<string, string> = {
    naira: 'Naira',
    usdt: 'USDT',
    usd: 'USD',
    btc: 'BTC',
    ethereum: 'ETH',
  }
  return labels[walletType] ?? walletType
}

export function getWalletSymbol(walletType: string): string {
  const symbols: Record<string, string> = {
    naira: '₦',
    usdt: '₮',
    usd: '$',
    btc: '₿',
    ethereum: 'Ξ',
  }
  return symbols[walletType] ?? ''
}

export function holdingIdToAsset(holdingId: string): string {
  if (holdingId === 'naira') return 'NGN'
  if (holdingId === 'usd') return 'USD'
  if (holdingId === 'btc') return 'BTC'
  return holdingId.toUpperCase()
}

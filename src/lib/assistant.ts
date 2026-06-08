const MOCK_RESPONSES: Record<string, string> = {
  'what is usdt?':
    'USDT (Tether) is a stablecoin pegged to the US Dollar. On SwiftyEx, USDT lets you hold dollar value without bank delays — perfect for saving, swapping, or sending crypto across borders.',
  'how do swaps work?':
    'Swaps let you exchange one asset for another instantly at live rates. Choose your source wallet (e.g. Naira), pick the asset you want (e.g. USDT), enter an amount, and confirm. SwiftyEx handles the conversion at the current buy/sell rate.',
  'explain otc trading.':
    'OTC (Over-The-Counter) trading is for larger orders that need personalised rates and settlement. Instead of matching on the open market, you deal directly with SwiftyEx for better pricing, faster execution, and dedicated support.',
  'how do i deposit funds?':
    'To deposit: open your wallet card on the home screen, copy your deposit address (for USDT on Tron), send funds from your external wallet, and wait for confirmation. Naira deposits are credited via bank transfer to your assigned account.',
}

const KEYWORD_MATCHES: { keywords: string[]; key: string }[] = [
  { keywords: ['usdt', 'tether', 'stablecoin'], key: 'what is usdt?' },
  { keywords: ['swap', 'exchange', 'convert'], key: 'how do swaps work?' },
  { keywords: ['otc', 'over the counter', 'large'], key: 'explain otc trading.' },
  { keywords: ['deposit', 'fund', 'add money', 'top up'], key: 'how do i deposit funds?' },
]

export const SUGGESTED_PROMPTS = [
  'What is USDT?',
  'How do swaps work?',
  'Explain OTC trading.',
  'How do I deposit funds?',
]

export function getAssistantResponse(input: string): string {
  const normalized = input.trim().toLowerCase()

  if (MOCK_RESPONSES[normalized]) {
    return MOCK_RESPONSES[normalized]
  }

  for (const match of KEYWORD_MATCHES) {
    if (match.keywords.some((kw) => normalized.includes(kw))) {
      return MOCK_RESPONSES[match.key]
    }
  }

  return "I'm SwiftyEx Assistant — here to help with crypto basics, deposits, swaps, and OTC trading. Try asking about USDT, how swaps work, or how to deposit funds!"
}

import type { Metadata } from 'next'
import Script from 'next/script'
import { AppDataProvider } from '@/components/providers/AppDataProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'SwiftyEx',
  description: 'SwiftyEx Telegram Mini App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased text-white">
        <div className="relative mx-auto min-h-dvh w-full max-w-app bg-white shadow-2xl shadow-black/40">
          <AppDataProvider>{children}</AppDataProvider>
        </div>
      </body>
    </html>
  )
}

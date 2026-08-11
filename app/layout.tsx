import type { Metadata } from 'next'
import { Inter, Bebas_Neue, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SSC Sports Portal | GLA University',
  description: 'Official sports portal for AAGAAZ 2026 - Students Sports Council, GLA University',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${space.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AAGAAZ 2026" />
        <meta name="theme-color" content="#030A03" />
      </head>
      <body className="bg-[#030A03] text-[#F0FFF0] font-inter antialiased">
        {children}
      </body>
    </html>
  )
}

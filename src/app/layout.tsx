// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import DebugInfo from '@/components/DebugInfo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PrintCare - Business Management System',
  description: 'Complete business management solution for printer services and cartridge supplies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <DebugInfo />
        </Providers>
      </body>
    </html>
  )
}
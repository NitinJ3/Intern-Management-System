// app/layout.tsx
import type { Metadata } from 'next'
import StoreProvider from '@/components/StoreProvider'
import './globals.css'

export const metadata: Metadata = { title: 'Intern Management System' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'AI Chat Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}

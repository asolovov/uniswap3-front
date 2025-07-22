import type { Metadata } from 'next'
import './globals.css'
import Nav from "@/components/nav/nav";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Nav/>
      {children}
      </body>
    </html>
  )
}

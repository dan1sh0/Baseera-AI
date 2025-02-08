import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from "@/components/navbar"
import './globals.css'

// Load Inter font for general text
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Baseera AI',
  description: 'Islamic Text Search powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
} 
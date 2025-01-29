import type { Metadata } from 'next'
import { Inter, Amiri } from 'next/font/google'
import { Navbar } from "@/components/navbar"
import './globals.css'

// Load Inter font for general text
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

// Load Amiri font for Arabic text
const amiri = Amiri({ 
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-amiri',
})

export const metadata: Metadata = {
  title: 'Sheikh AI - Islamic Knowledge Assistant',
  description: 'Get authentic answers about Islam from Quran and Hadith',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
} 
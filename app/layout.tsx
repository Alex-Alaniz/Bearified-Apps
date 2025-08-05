import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PrivyWrapper } from "@/components/privy-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bearified Apps - Unified Business Platform",
  description: "Your unified business platform for SoleBrew and Chimpanion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyWrapper>
          {children}
          <Toaster />
        </PrivyWrapper>
      </body>
    </html>
  )
}
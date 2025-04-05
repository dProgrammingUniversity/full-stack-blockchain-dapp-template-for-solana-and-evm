import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/navigation/header"
import Footer from "@/components/navigation/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Solomon Foskaay - Web3 Developer Portfolio",
  description: "Full-stack web3 developer specializing in blockchain technology and decentralized applications",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
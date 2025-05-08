import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/navigation/header"
import Footer from "@/components/navigation/footer"
import { ClientWalletProvider } from "@/providers/solana/ClientWalletProvider"
import { EthereumProvider } from "@/providers/ethereum/EthereumProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "dPU dApp Template - For Solana and EVM Full Stack Developer",
  description: "Full-stack dPU dApp Template - For Solana and EVM Full Stack Developer",
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
          <ClientWalletProvider>
            <EthereumProvider>
            <Header />
            {children}
            <Footer />
          </EthereumProvider>
          </ClientWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
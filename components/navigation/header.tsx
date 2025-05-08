'use client'

import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { SolanaWalletsButton } from "@/components/blockchain/solana/SolanaWalletsButton"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsLoggedIn(true)
        setUserEmail(data.session.user.email ?? null) // Use nullish coalescing
      }
    }
    checkAuth()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUserEmail(null)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Solana Dex - Jupiter</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="#about" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="#skills" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Skills
            </Link>
            <Link href="#projects" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Projects
            </Link>
            <Link href="#contact" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="/project-form" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Add Projects
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            <Link href="https://github.com/sample" target="_blank" rel="noreferrer">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href="https://twitter.com/Sample" target="_blank" rel="noreferrer">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <Link href="https://linkedin.com/in/Sample" target="_blank" rel="noreferrer">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </div>
            </Link>

            {/* Solana wallet multibutton */}
            <SolanaWalletsButton />

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Hi {userEmail?.slice(0, 4)}...</span>
                <Button onClick={handleLogout} className="bg-red-500 text-white">
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth/signup">
                  <Button className="bg-green-500 text-white">Signup</Button>
                </Link>
                <Link href="/auth/login">
                  <Button className="bg-green-500 text-white">Login</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
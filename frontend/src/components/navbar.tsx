"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { IslamicDate } from "./IslamicDate"

export function Navbar() {
  const [isDark, setIsDark] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Search className="h-5 w-5 text-primary" />
            <span>Baseera AI</span>
            <span className="text-xs text-muted-foreground font-normal">
              Islamic Text Search
            </span>
          </Link>

          <IslamicDate />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
} 
"use client"

import { Bookmark } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface BookmarkButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function BookmarkButton({ className, ...props }: BookmarkButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("hover:bg-transparent", className)}
      {...props}
    >
      <Bookmark className="h-5 w-5" />
      <span className="sr-only">Bookmark</span>
    </Button>
  )
} 
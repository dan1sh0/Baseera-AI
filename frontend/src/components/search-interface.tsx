"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bookmark, Send } from "lucide-react"
import { useState, useEffect } from "react"
import { sendMessage, getDailyReminder } from '@/utils/api'
import type { DailyReminder as DailyReminderType } from '@/types'

export function SearchInterface() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Daily Reminder Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Daily Reminder</h2>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-arabic text-right leading-relaxed">
              فَإِنَّ مَعَ الْعُسْرِ يُسْرًا
            </p>
            <p className="text-neutral-600">
              "Verily, with hardship comes ease."
            </p>
            <p className="text-sm text-neutral-500">Quran 94:5</p>
          </div>
        </div>
      </Card>

      {/* Main Search Section */}
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Baseera AI</h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Search the Quran and authentic Hadith collections for specific references and verses. 
            Get direct textual sources without interpretations or rulings.
          </p>
          <p className="text-sm text-neutral-500">
            For interpretations or religious rulings, please consult qualified Islamic scholars.
          </p>
        </div>

        <div className="relative">
          <Input
            placeholder="Search for verses or hadith about..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="pr-12 py-6 text-lg"
          />
          <Button 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {/* Example Queries */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-600">Example searches</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Which Surahs are Makki?",
              "Show ayahs about kindness",
              "Hadith mentioning Abu Bakr (RA)",
              "Verses about patience",
            ].map((q) => (
              <Button 
                key={q} 
                variant="secondary" 
                className="text-sm"
                onClick={() => setQuestion(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
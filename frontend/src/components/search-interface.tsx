"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bookmark, Send, Loader2 } from "lucide-react"
import { useState } from "react"
import type { SearchResult } from "@/types"

export function SearchInterface() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(question)}&search_type=hybrid`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      const data = await response.json()
      // Make sure we have results array before setting state
      setResults(data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
      setError('Failed to connect to search service. Please make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Daily Reminder Card */}
      <Card className="p-6 bg-primary-50 border-primary-100">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-700">Daily Reminder</h2>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
              <span className="sr-only">Bookmark</span>
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-arabic text-right leading-relaxed">
              قَالُوا ادْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا هِيَ قَالَ إِنَّهُ يَقُولُ إِنَّهَا بَقَرَةٌ لَّا فَارِضٌ وَلَا بِكْرٌ عَوَانٌ بَيْنَ ذَٰلِكَ ۖ فَافْعَلُوا مَا تُؤْمَرُونَ
            </p>
            <p className="text-neutral-600">
              Said they: "Pray on our behalf unto thy Sustainer that He make clear to us what she is to be like."
              [Moses] replied: "Behold, He says it is to be a cow neither old nor immature, but of an age in-between.
              Do, then, what you have been bidden!"
            </p>
            <p className="text-sm text-neutral-500">Quran 2:68</p>
          </div>
        </div>
      </Card>

      {/* Main Search Section */}
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Baseera</h1>
          <p className="text-lg text-neutral-600">
            Search the Quran and authentic Hadiths to find specific verses, chapters, and narrations
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Search Quran verses and Hadiths..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="text-lg py-6"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              className="h-auto w-14"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-neutral-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Display Results */}
        {!isLoading && results && results.length > 0 && (
          <div className="space-y-4 text-left">
            {results.map((result) => (
              <Card key={result.id} className="p-4">
                <div className="mb-2 text-sm text-gray-600">
                  {result.surah_name} ({result.surah_number}:{result.verse_number})
                </div>
                <div className="text-xl mb-2 font-arabic" dir="rtl">
                  {result.arabic}
                </div>
                <div className="text-gray-700">
                  {result.english}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!isLoading && results && results.length === 0 && !error && (
          <div className="text-neutral-600">No results found</div>
        )}

        {/* Example Questions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-600">Example searches</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Show verses about patience from Meccan surahs",
              "Find hadiths narrated by Abu Hurairah about fasting",
              "List all verses mentioning Prophet Musa",
            ].map((q) => (
              <Button key={q} variant="secondary" className="text-sm" onClick={() => setQuestion(q)}>
                {q}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 
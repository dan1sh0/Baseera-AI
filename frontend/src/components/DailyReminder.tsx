"use client"

import { Card } from "./ui/card"
import { BookmarkButton } from "./BookmarkButton"

export function DailyReminder() {
  return (
    <Card className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Daily Reminder</h2>
      <div className="text-2xl mb-4 font-arabic text-right" dir="rtl">
        قَالُوا ادْعُ لَنَا رَبَّكَ يُبَيِّن لَّنَا مَا هِيَ قَالَ إِنَّهُ يَقُولُ إِنَّهَا بَقَرَةٌ لَّا فَارِضٌ وَلَا بِكْرٌ عَوَانٌ بَيْنَ ذَٰلِكَ فَافْعَلُوا مَا تُؤْمَرُونَ
      </div>
      <p className="text-gray-700 mb-2">
        Said they: "Pray on our behalf unto thy Sustainer that He make clear to us what she is to be like." [Moses] replied: "Behold, He says it is to be a cow neither old nor immature, but of an age in-between. Do, then, what you have been bidden!"
      </p>
      <div className="text-sm text-gray-500">Quran 2:68</div>
      <BookmarkButton className="absolute top-4 right-4" />
    </Card>
  )
} 
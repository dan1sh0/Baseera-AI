'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { CalendarDays, Calendar } from "lucide-react";

interface IslamicDateInfo {
  day: number;
  month: string;
  year: number;
  gregorianDate: string;
  hijriMonth: number;
}

const ISLAMIC_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

// Islamic historical events with descriptions
const historicalEvents: Record<string, { title: string; description: string }> = {
  "1 Muharram": {
    title: "Islamic New Year",
    description: "The beginning of the Islamic calendar, marking the Hijra of Prophet Muhammad ﷺ"
  },
  "10 Muharram": {
    title: "Day of Ashura",
    description: "A blessed day when Allah saved Prophet Musa (AS) and his followers"
  },
  "12 Rabi al-Awwal": {
    title: "Birth of Prophet Muhammad ﷺ",
    description: "The blessed day when our beloved Prophet ﷺ was born"
  },
  "27 Rajab": {
    title: "Night Journey",
    description: "Al-Isra' wal-Mi'raj - The miraculous night journey of Prophet Muhammad ﷺ"
  },
  "1 Ramadan": {
    title: "Beginning of Ramadan",
    description: "The start of the blessed month of fasting and increased worship"
  },
  "27 Ramadan": {
    title: "Laylat al-Qadr",
    description: "The Night of Power, better than a thousand months"
  }
};

export function IslamicDate() {
  const [date, setDate] = useState<IslamicDateInfo | null>(null);
  const [event, setEvent] = useState<{ title: string; description: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getIslamicDate = () => {
      try {
        const today = new Date();
        const islamicDate = new Intl.DateTimeFormat('en-u-ca-islamic', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(today);

        const gregorianDate = today.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Parse the formatted date
        const [month, day, year] = islamicDate.split(' ');
        const monthIndex = ISLAMIC_MONTHS.findIndex(m => m.toLowerCase() === month.toLowerCase());

        setDate({
          day: parseInt(day.replace(',', '')),
          month: month,
          year: parseInt(year),
          gregorianDate,
          hijriMonth: monthIndex + 1
        });

        // Check for historical events
        const dateKey = `${parseInt(day)} ${month}`;
        const todayEvent = historicalEvents[dateKey];
        if (todayEvent) {
          setEvent(todayEvent);
        }
      } catch (error) {
        console.error('Error getting Islamic date:', error);
      }
    };

    getIslamicDate();
  }, []);

  if (!date) return null;

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-accent transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Calendar className="h-4 w-4 text-primary" />
        <time dateTime={`${date.year}-${date.month}-${date.day}`} className="flex items-center gap-1">
          <span className="font-arabic">{date.day}</span>
          <span>{ISLAMIC_MONTHS[date.hijriMonth - 1]}</span>
          <span className="font-arabic">{date.year} AH</span>
        </time>
      </button>

      {/* Hover Card */}
      {isHovered && (
        <Card className="absolute top-full mt-2 left-0 w-80 p-4 z-50 shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium">Islamic Date</h3>
              <p className="text-sm text-muted-foreground">
                {date.day} {date.month} {date.year} AH
              </p>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-medium">Gregorian Date</h3>
              <p className="text-sm text-muted-foreground">{date.gregorianDate}</p>
            </div>

            {event && (
              <div className="space-y-1 border-t pt-3">
                <h3 className="font-medium text-primary">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';

const hijriMonths = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

// Islamic historical events
const historicalEvents: Record<string, string> = {
  "1 Muharram": "Islamic New Year",
  "10 Muharram": "Day of Ashura",
  "12 Rabi' al-Awwal": "Birth of Prophet Muhammad ﷺ",
  "27 Rajab": "Night Journey (Al-Isra' wal-Mi'raj)",
  "1 Ramadan": "Beginning of the Month of Fasting",
  "27 Ramadan": "Laylat al-Qadr (Night of Power)",
  "1 Shawwal": "Eid al-Fitr",
  "9 Dhu al-Hijjah": "Day of Arafah",
  "10 Dhu al-Hijjah": "Eid al-Adha",
  "22 Rajab": "Victory of Khaybar (7 AH)"
};

// Simple Hijri date calculation
const getHijriDate = () => {
  // Known date pairs (Gregorian to Hijri)
  const knownGregorian = new Date(2024, 1, 3); // February 3, 2024
  const knownHijriDay = 22; // Known accurate date: 22 Rajab 1445
  const knownHijriMonth = 6; // Rajab is the 7th month (index 6)
  const knownHijriYear = 1445;

  const today = new Date();
  const diffDays = Math.floor(
    (today.getTime() - knownGregorian.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate current Hijri date
  let hijriDay = knownHijriDay + diffDays;
  let hijriMonth = knownHijriMonth;
  let hijriYear = knownHijriYear;

  // Adjust for month transitions (approximate)
  const daysInMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29]; // Islamic months alternate between 30 and 29 days

  while (hijriDay > daysInMonth[hijriMonth]) {
    hijriDay -= daysInMonth[hijriMonth];
    hijriMonth++;
    if (hijriMonth > 11) {
      hijriMonth = 0;
      hijriYear++;
    }
  }
  while (hijriDay < 1) {
    hijriMonth--;
    if (hijriMonth < 0) {
      hijriMonth = 11;
      hijriYear--;
    }
    hijriDay += daysInMonth[hijriMonth];
  }

  return {
    day: hijriDay,
    month: hijriMonths[hijriMonth],
    year: hijriYear
  };
};

export const IslamicDate = () => {
  const [date, setDate] = useState<string>('');
  const [event, setEvent] = useState<string>('');

  useEffect(() => {
    const hijri = getHijriDate();
    setDate(`${hijri.day} ${hijri.month} ${hijri.year} AH`);

    // Check for historical events
    const dateKey = `${hijri.day} ${hijri.month}`;
    const todayEvent = historicalEvents[dateKey];
    if (todayEvent) {
      setEvent(todayEvent);
    }
  }, []);

  return (
    <div className="text-center mb-6">
      <div className="inline-block bg-green-100 rounded-full px-4 py-1 mb-2">
        <p className="text-sm text-green-800 font-medium">{date}</p>
      </div>
      {event && (
        <div className="text-xs text-gray-600 mt-1">
          On this day: {event}
        </div>
      )}
    </div>
  );
}; 
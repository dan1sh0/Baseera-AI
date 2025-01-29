'use client';

import { useState, useEffect } from 'react';
import { IslamicDate } from './IslamicDate';
import { BookmarkButton } from './BookmarkButton';

interface Reminder {
  arabic: string;
  english: string;
  source: string;
  type: 'quran' | 'hadith';
}

const fetchWithRetry = async (url: string, options?: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
    }
  }
  throw new Error('Failed to fetch after all retries');
};

export default function DailyReminder() {
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const type = Math.random() > 0.5 ? 'quran' : 'hadith';
        
        if (type === 'quran') {
          const ayahNumber = Math.floor(Math.random() * 6236) + 1;
          const response = await fetchWithRetry(
            `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`
          );
          
          const data = await response.json();
          
          if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid data structure from API");
          }
          
          // Log the data to see its structure
          console.log('Quran API response:', data.data[0]);
          
          setReminder({
            arabic: data.data[0].text,
            english: data.data[1].text,
            // Access the surah number and verse number directly
            source: `Quran ${data.data[0].surah.number}:${data.data[0].numberInSurah}`,
            type: 'quran'
          });
        } else {
          // Get random Hadith using Hadith API
          const hadithNumber = Math.floor(Math.random() * 7500) + 1;
          const book = Math.random() > 0.5 ? 'sahih-bukhari' : 'sahih-muslim';
          
          const response = await fetchWithRetry(
            `https://www.hadithapi.com/api/hadiths?hadithNumber=${hadithNumber}&book=${book}&status=sahih`,
            {
              headers: {
                'apiKey': process.env.NEXT_PUBLIC_HADITH_API_KEY!
              }
            }
          );
          
          const data = await response.json();
          
          if (!data.hadiths || !data.hadiths[0]) {
            throw new Error("No hadith found");
          }
          
          const hadith = data.hadiths[0];
          setReminder({
            arabic: hadith.hadithArabic,
            english: hadith.hadithEnglish,
            source: `${hadith.book} - Hadith ${hadith.hadithNumber}`,
            type: 'hadith'
          });
        }
      } catch (error) {
        console.error('Error fetching reminder:', error);
        // Fallback reminder
        setReminder({
          arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
          english: "Verily, with hardship comes ease.",
          source: "Quran 94:5",
          type: 'quran'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReminder();
  }, []);

  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-800">Daily Reminder</h2>
        {reminder && <BookmarkButton reminder={reminder} />}
      </div>
      {loading ? (
        <div className="animate-pulse">Loading...</div>
      ) : reminder ? (
        <>
          <p className="text-right font-arabic text-xl mb-2">{reminder.arabic}</p>
          <p className="text-gray-700 mb-2">{reminder.english}</p>
          <p className="text-sm text-gray-500">{reminder.source}</p>
        </>
      ) : (
        <p>Failed to load reminder</p>
      )}
    </div>
  );
} 
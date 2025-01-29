'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Reminder {
  arabic: string;
  english: string;
  source: string;
  type: 'quran' | 'hadith';
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Reminder[]>([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedReminders') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  const removeBookmark = (source: string) => {
    const newBookmarks = bookmarks.filter(b => b.source !== source);
    localStorage.setItem('bookmarkedReminders', JSON.stringify(newBookmarks));
    setBookmarks(newBookmarks);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-green-800">Bookmarked Reminders</h1>
        <Link 
          href="/"
          className="text-green-600 hover:text-green-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No bookmarked reminders yet</p>
          <Link 
            href="/" 
            className="text-green-600 hover:text-green-700 underline"
          >
            Return home to bookmark some reminders
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks.map((bookmark, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-green-600 font-medium">
                  {bookmark.type === 'quran' ? 'Quranic Verse' : 'Hadith'}
                </span>
                <button
                  onClick={() => removeBookmark(bookmark.source)}
                  className="text-red-400 hover:text-red-500 p-1"
                  title="Remove bookmark"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-right font-arabic text-xl mb-2">{bookmark.arabic}</p>
              <p className="text-gray-700 mb-2">{bookmark.english}</p>
              <p className="text-sm text-gray-500">{bookmark.source}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
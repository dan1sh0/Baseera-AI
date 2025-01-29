'use client';

import { useState, useEffect } from 'react';

interface BookmarkButtonProps {
  reminder: {
    arabic: string;
    english: string;
    source: string;
    type: 'quran' | 'hadith';
  };
}

export function BookmarkButton({ reminder }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if this reminder is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedReminders') || '[]');
    setIsBookmarked(bookmarks.some((b: typeof reminder) => b.source === reminder.source));
  }, [reminder]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedReminders') || '[]');
    
    if (isBookmarked) {
      // Remove bookmark
      const newBookmarks = bookmarks.filter((b: typeof reminder) => b.source !== reminder.source);
      localStorage.setItem('bookmarkedReminders', JSON.stringify(newBookmarks));
    } else {
      // Add bookmark
      bookmarks.push(reminder);
      localStorage.setItem('bookmarkedReminders', JSON.stringify(bookmarks));
    }
    
    setIsBookmarked(!isBookmarked);
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`p-2 rounded-full transition-colors ${
        isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this reminder'}
    >
      {isBookmarked ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      )}
    </button>
  );
} 
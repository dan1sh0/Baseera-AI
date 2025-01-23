'use client';

import { useState, useEffect } from 'react';
import { IslamicDate } from './IslamicDate';

const dailyReminders = [
  {
    type: 'hadith',
    text: "The Prophet ﷺ said: 'The best among you are those who have the best manners and character.'",
    source: "Sahih al-Bukhari 3559",
    arabic: "خَيْرُكُمْ أَحْسَنُكُمْ خُلُقًا"
  },
  {
    type: 'quran',
    text: "Verily, with hardship comes ease.",
    source: "Quran 94:5",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا"
  },
  {
    type: 'hadith',
    text: "The Prophet ﷺ said: 'None of you truly believes until he loves for his brother what he loves for himself.'",
    source: "Sahih al-Bukhari 13",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ"
  }
];

export const DailyReminder = () => {
  const [reminder, setReminder] = useState(dailyReminders[0]);

  useEffect(() => {
    const today = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / (24 * 60 * 60 * 1000));
    const reminderIndex = today % dailyReminders.length;
    setReminder(dailyReminders[reminderIndex]);
  }, []);

  return (
    <div className="bg-green-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
      <IslamicDate />
      <h3 className="text-lg font-semibold text-green-800 mb-2">Daily Reminder</h3>
      <div className="text-right mb-3">
        <p className="font-arabic text-lg text-gray-800">{reminder.arabic}</p>
      </div>
      <p className="text-gray-700 mb-2 italic">{reminder.text}</p>
      <p className="text-sm text-green-700 font-medium">{reminder.source}</p>
    </div>
  );
}; 
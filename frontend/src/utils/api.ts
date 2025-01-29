import { DailyReminder } from '@/types'

export async function sendMessage(message: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getDailyReminder(): Promise<DailyReminder> {
  try {
    const ayahNumber = Math.floor(Math.random() * 6236) + 1;
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch daily reminder');
    }

    const data = await response.json();
    return {
      arabic: data.data[0].text,
      english: data.data[1].text,
      source: `Quran ${data.data[0].surah.number}:${data.data[0].numberInSurah}`,
    };
  } catch (error) {
    console.error('Error:', error);
    // Fallback reminder
    return {
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english: "Verily, with hardship comes ease.",
      source: "Quran 94:5",
    };
  }
} 
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Mock response for testing
    const mockResponse = {
      answer: "Here's a mock response about " + message,
      references: [
        {
          type: 'quran',
          citation: 'Quran (2:255)',
          arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
          english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.'
        }
      ]
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 
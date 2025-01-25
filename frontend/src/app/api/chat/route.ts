import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    console.log('Sending request to:', `${API_URL}/api/chat`);  // Debug log

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      console.error('Backend response error:', response.status, await response.text());  // Debug log
      throw new Error(`Failed to fetch response: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Detailed error:', error);  // Debug log
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
} 
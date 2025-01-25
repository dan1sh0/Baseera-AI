'use client';

import { useState } from 'react';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatMessage } from '../components/chat/ChatMessage';
import { Message } from '../types';
import { DailyReminder } from '../components/DailyReminder';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setIsLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isBot: true,
        references: data.references,
      };

      setMessages(prev => [...prev, botMessage]);
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-8 pb-24">
        {messages.length === 0 && (
          <>
            <DailyReminder />
            <div className="text-center py-8 px-4">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome to Sheikh AI</h2>
              <p className="text-gray-600 mb-4">
                Ask questions about Islam and receive answers based on the Quran and authentic Hadiths.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg max-w-lg mx-auto">
                <p className="text-gray-700 font-medium mb-2">Example questions:</p>
                <ul className="text-gray-600 space-y-2">
                  <li>• What does Islam say about kindness to parents?</li>
                  <li>• How should I perform the daily prayers?</li>
                  <li>• What are the pillars of Islam?</li>
                </ul>
              </div>
            </div>
          </>
        )}
        <div className="space-y-4 px-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              references={message.references}
            />
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <form onSubmit={handleSubmit} className="flex items-center p-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full p-2 border rounded mr-4"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {loading ? 'Loading...' : 'Ask'}
            </button>
          </form>
        </div>
        {answer && (
          <div className="bg-gray-100 p-4 rounded-t">
            <h2 className="font-bold mb-2">Answer:</h2>
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </main>
  );
} 
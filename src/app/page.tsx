'use client';

import { useState } from 'react';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatMessage } from '../components/chat/ChatMessage';
import { Message } from '../types';
import { DailyReminder } from '../components/DailyReminder';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isBot: true,
        references: data.references,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
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
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
} 
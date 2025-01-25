import React from 'react';
import { ChatMessageProps } from '../../types';
import { LoadingDots } from './LoadingDots';

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, references }) => {
  // Function to format the message with proper spacing and styling
  const formatMessage = (text: string) => {
    const sections = text.split('---');
    
    return sections.map((section, index) => {
      if (section.trim().startsWith('Quranic Verses') || section.trim().startsWith('Hadiths')) {
        const lines = section.split('\n').map((line, lineIndex) => {
          // Check if line contains Arabic text (contains Arabic Unicode characters)
          const hasArabic = /[\u0600-\u06FF]/.test(line);
          
          if (line.startsWith('Source:')) {
            return (
              <div key={lineIndex} className="text-sm text-gray-500 mt-1 mb-4">
                {line}
              </div>
            );
          }
          
          if (hasArabic && !line.startsWith('Arabic:')) {
            return (
              <div key={lineIndex} className="text-right font-arabic text-xl my-4 leading-loose">
                {line}
              </div>
            );
          }
          
          return <div key={lineIndex} className="my-2">{line}</div>;
        });
        
        return (
          <div key={index} className="my-6 bg-gray-50 p-4 rounded-lg">
            {lines}
          </div>
        );
      }
      
      // Format summary and conclusion sections
      if (section.includes('[Summary]') || section.includes('[Conclusion]')) {
        return (
          <div key={index} className="my-4 p-4 bg-white rounded-lg">
            {section.split('\n').map((line, lineIndex) => (
              <div key={lineIndex} className="my-2">
                {line}
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div key={index} className="my-4">
          {section}
        </div>
      );
    });
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
        isBot ? 'bg-white border border-gray-200' : 'bg-green-50'
      }`}>
        {message === '...' ? (
          <LoadingDots />
        ) : (
          <>
            {isBot ? formatMessage(message) : message}
            {references && references.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {references.map((ref, index) => (
                  <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-green-700">{ref.citation}</p>
                    <p className="text-right font-arabic my-2 text-lg">{ref.arabic}</p>
                    <p className="text-gray-700">{ref.english}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 
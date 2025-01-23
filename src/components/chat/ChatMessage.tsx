import { ChatMessageProps } from 'Sheikh-AI/src/types';
import { LoadingDots } from './LoadingDots';

export const ChatMessage = ({ message, isBot, references }: ChatMessageProps) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-lg shadow-sm ${
        isBot ? 'bg-white border border-gray-200' : 'bg-green-50'
      }`}>
        {message === '...' ? (
          <LoadingDots />
        ) : (
          <>
            <p className="text-gray-800 leading-relaxed">{message}</p>
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
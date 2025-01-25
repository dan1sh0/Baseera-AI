import { ChatMessage } from './ChatMessage';
import { Message } from 'Sheikh-AI/src/types';

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory = ({ messages }: ChatHistoryProps) => {
  return (
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
  );
};
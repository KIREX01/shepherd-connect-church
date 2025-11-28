
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: () => void;
  onTyping?: () => void;
}

export const MessageInput = ({ newMessage, setNewMessage, onSendMessage, onTyping }: MessageInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (onTyping) onTyping();
          }}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={onSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

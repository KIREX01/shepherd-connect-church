
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Message {
  read_at: any;
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
    id: string;
    last_message_at: string | null;
    other_user: {
      id: string;
      name: string;
    };
  }

interface MessageViewProps {
  messages: Message[];
  currentUserId: string | null;
  selectedConversationData: Conversation | undefined;
  isLoading?: boolean;
}

export const MessageView = ({ messages, currentUserId, selectedConversationData, isLoading = false }: MessageViewProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change or loading finishes
    if (!isLoading) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [messages, isLoading]);
  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{selectedConversationData?.other_user.name}</CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex-1 h-full flex items-center justify-center text-muted-foreground">
            Loading messages...
          </div>
        ) : null}
        {!isLoading && messages.length === 0 ? (
          <div 
          className="flex-1 h-full flex items-center justify-center text-muted-foreground">
            No messages yet. Say hello 👋
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.sender_id === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="break-words">{msg.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs opacity-70">{format(new Date(msg.created_at), 'h:mm a')}</p>
                  {msg.sender_id === currentUserId && (
                    <span className="text-xs opacity-70">
                      {msg.read_at ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
                {/* tail */}
                <span
                  className={`hidden sm:block absolute bottom-0 ${
                    msg.sender_id === currentUserId ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                  } w-3 h-3 rotate-45 ${msg.sender_id === currentUserId ? 'bg-primary' : 'bg-muted'}`}
                />
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </ScrollArea>
    </>
  );
};

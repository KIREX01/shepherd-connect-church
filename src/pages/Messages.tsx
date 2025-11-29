import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ConversationList } from '@/components/chat/ConversationList';
import { MessageView } from '@/components/chat/MessageView';
import { MessageInput } from '@/components/chat/MessageInput';
import { useIsMobile } from '@/hooks/use-mobile';

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string | null;
  updated_at: string;
  other_user: {
    id: string;
    name: string;
  };
  unread_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});
  const activeChannelRef = useRef<any | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);
    await Promise.all([fetchConversations(user.id), fetchMembers()]);
    setLoading(false);
  };

  const fetchConversations = async (userId: string) => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    const conversationsWithUsers = await Promise.all(
      (data || []).map(async (conv) => {
        const otherId = conv.participant_1 === userId ? conv.participant_2 : conv.participant_1;
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('user_id', otherId)
          .single();

        return {
          ...conv,
          other_user: {
            id: otherId,
            name: profileData
              ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown User'
              : 'Unknown User'
          }
        };
      })
    );

    setConversations(conversationsWithUsers);
  };

  const fetchMembers = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name');

    if (!profilesError && profiles) {
      setMembers(
        profiles
          .filter(p => p.user_id !== currentUserId)
          .map((p: any) => ({
            id: p.user_id,
            first_name: p.first_name || 'Unknown',
            last_name: p.last_name || 'User',
            email: '',
          }))
      );
    } else {
      console.error('Error fetching members:', profilesError);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setMessagesLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
      // mark unread messages in this conversation as read for current user
      try {
        if (currentUserId) {
          await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('conversation_id', conversationId)
            .neq('sender_id', currentUserId)
            .is('read_at', null);
        }
      } catch (err) {
        console.error('Error marking messages read', err);
      }
    } else if (error) {
      console.error('Error fetching messages:', error);
    }
    setMessagesLoading(false);
  };

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      if (isMobile) {
        setViewMode('chat');
      }

      const ch = supabase.channel(`messages-${selectedConversation}`);

      ch.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${selectedConversation}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      });

      // Listen for typing broadcasts
      ch.on('broadcast', { event: 'typing' }, (payload) => {
        const { userId, typing } = payload.payload || payload;
        if (!userId || userId === currentUserId) return;
        setTypingUsers((prev) => {
          if (typing) {
            if (prev.includes(userId)) return prev;
            return [...prev, userId];
          } else {
            return prev.filter((u) => u !== userId);
          }
        });
        // auto-remove after 3s
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== userId));
        }, 3000);
      });

      // Listen for presence broadcasts
      ch.on('broadcast', { event: 'presence' }, (payload) => {
        const { userId, status } = payload.payload || payload;
        if (!userId) return;
        setPresenceMap((prev) => ({ ...prev, [userId]: status === 'online' }));
      });

      ch.subscribe();
      activeChannelRef.current = ch;
      // announce presence
      if (currentUserId) {
        try {
          ch.send({ type: 'broadcast', event: 'presence', payload: { userId: currentUserId, status: 'online' } });
        } catch (err: any) {
          console.error('Subscribe/send presence error', err);
        }
      }

      return () => {
        // announce offline
        if (activeChannelRef.current && currentUserId) {
          activeChannelRef.current.send({ type: 'broadcast', event: 'presence', payload: { userId: currentUserId, status: 'offline' } });
        }
        if (ch) supabase.removeChannel(ch);
        activeChannelRef.current = null;
      };
    }
  }, [selectedConversation, isMobile]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUserId) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation,
        sender_id: currentUserId,
        content: newMessage.trim()
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } else {
      setNewMessage('');
      // broadcast that user stopped typing
      if (activeChannelRef.current && currentUserId) {
        try { activeChannelRef.current.send({ type: 'broadcast', event: 'typing', payload: { userId: currentUserId, typing: false } }); } catch (e) { /* ignore */ }
      }
    }
  };

  const startNewConversation = async (memberId: string) => {
    if (!currentUserId) return;
    
    // Check if a conversation already exists
    const { data: existingConversations, error: existingError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${currentUserId},participant_2.eq.${memberId}),and(participant_1.eq.${memberId},participant_2.eq.${currentUserId})`);

    if (existingError) {
      console.error('Error checking for existing conversation', existingError);
      return;
    }

    if (existingConversations && existingConversations.length > 0) {
      setSelectedConversation(existingConversations[0].id);
      await fetchMessages(existingConversations[0].id);
      if (isMobile) setViewMode('chat');
      return;
    }

    // No existing conversation — create one and select it.
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          participant_1: currentUserId,
          participant_2: memberId,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      // Handle unique constraint or other errors
      if (error.code === '23505') {
        toast({ title: 'Info', description: 'Conversation already exists' });
        await fetchConversations(currentUserId);
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create conversation',
          variant: 'destructive',
        });
        console.error('Error creating conversation', error);
      }
      return;
    }

    if (data) {
      await fetchConversations(currentUserId);
      setSelectedConversation(data.id);
      await fetchMessages(data.id);
      if (isMobile) setViewMode('chat');
    }
  };

  const sendTypingEvent = (isTyping: boolean) => {
    if (!activeChannelRef.current || !currentUserId) return;
    try {
      activeChannelRef.current.send({ type: 'broadcast', event: 'typing', payload: { userId: currentUserId, typing: isTyping } });
    } catch (e) {
      // ignore
    }
  };

  const handleTyping = () => {
    sendTypingEvent(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      sendTypingEvent(false);
    }, 2000);
  };

  const selectedConvData = conversations.find(c => c.id === selectedConversation);

  const renderContent = () => {
    if (isMobile) {
      if (viewMode === 'list') {
        return (
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onStartNewConversation={startNewConversation}
            currentUserId={currentUserId}
            members={members}
            isLoading={loading}
          />
        );
      } else {
        return (
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <MessageView
                  messages={messages}
                  currentUserId={currentUserId}
                  selectedConversationData={selectedConvData}
                  isLoading={messagesLoading}
                />
                <MessageInput
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  onSendMessage={sendMessage}
                  onTyping={handleTyping}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        );
      }
    }

    return (
      <>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onStartNewConversation={startNewConversation}
          currentUserId={currentUserId}
          members={members}
          isLoading={loading}
        />
        <Card className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <MessageView
                messages={messages}
                currentUserId={currentUserId}
                selectedConversationData={selectedConvData}
                isLoading={messagesLoading}
              />
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={sendMessage}
                onTyping={handleTyping}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container mx-auto py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-120px)] md:h-[calc(100vh-140px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

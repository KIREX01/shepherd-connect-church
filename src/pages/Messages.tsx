import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
    const { data, error } = await supabase
      .from('member_registrations')
      .select('id, first_name, last_name, email');

    if (!error && data) {
      setMembers(data);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);

      const channel = supabase
        .channel(`messages-${selectedConversation}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

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
    }
  };

  const startNewConversation = async (memberId: string) => {
    if (!currentUserId) return;

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant_1: currentUserId,
        participant_2: memberId
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Info',
          description: 'Conversation already exists',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create conversation',
          variant: 'destructive'
        });
      }
    } else if (data) {
      await fetchConversations(currentUserId);
      setSelectedConversation(data.id);
    }
  };

  const selectedConvData = conversations.find(c => c.id === selectedConversation);

  const filteredMembers = members.filter(m => 
    m.id !== currentUserId &&
    (m.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     m.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     m.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          {/* Conversations List */}
          <Card className="w-full md:w-80 flex flex-col">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <ScrollArea className="h-[300px]">
                      {filteredMembers.map((member) => (
                        <Button
                          key={member.id}
                          variant="ghost"
                          className="w-full justify-start mb-2"
                          onClick={() => {
                            startNewConversation(member.id);
                            setSearchTerm('');
                          }}
                        >
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>
                              {member.first_name?.[0]}{member.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.first_name} {member.last_name}</span>
                        </Button>
                      ))}
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-2">
              {conversations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No conversations yet</p>
              ) : (
                conversations.map((conv) => (
                  <Button
                    key={conv.id}
                    variant={selectedConversation === conv.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start mb-2 h-auto py-3"
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback>
                        {conv.other_user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{conv.other_user.name}</p>
                      {conv.last_message_at && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(conv.last_message_at), 'MMM d, h:mm a')}
                        </p>
                      )}
                    </div>
                  </Button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Messages View */}
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle>{selectedConvData?.other_user.name}</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1 p-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.sender_id === currentUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

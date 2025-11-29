
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Conversation {
  id: string;
  last_message_at: string | null;
  unread_count?: number;
  other_user: {
    id: string;
    name: string;
  };
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
  onStartNewConversation: (memberId: string) => void;
  currentUserId: string | null;
  members: Member[];
  isLoading?: boolean;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onStartNewConversation,
  currentUserId,
  members,
  isLoading = false,
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredMembers = members.filter(m => 
    m.id !== currentUserId &&
    (m.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     m.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartConversation = (memberId: string) => {
    onStartNewConversation(memberId);
    setSearchTerm('');
    setDialogOpen(false);
  };

  return (
    <Card className="w-full md:w-80 flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                {filteredMembers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No members found</p>
                ) : (
                  filteredMembers.map((member) => (
                    <Button
                      key={member.id}
                      variant="ghost"
                      className="w-full justify-start mb-2"
                      onClick={() => handleStartConversation(member.id)}
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.first_name} {member.last_name}</span>
                    </Button>
                  ))
                )}
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-2">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="h-4 w-1/2 bg-muted rounded mb-2" />
                  <div className="h-3 w-1/3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={selectedConversation === conv.id ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-2 h-auto py-3"
              onClick={() => onSelectConversation(conv.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback>
                  {conv.other_user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{conv.other_user.name}</p>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
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
  );
};

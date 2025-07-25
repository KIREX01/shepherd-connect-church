
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Calendar, User, Pin } from 'lucide-react';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  category: string;
  is_pinned: boolean;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  author_name: string | null;
}

export function AnnouncementsList() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          author:profiles!announcements_created_by_fkey(first_name, last_name)
        `)
        .or('expires_at.is.null,expires_at.gte.now()')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedAnnouncements = data?.map(announcement => ({
        ...announcement,
        author_name: announcement.author 
          ? `${announcement.author.first_name} ${announcement.author.last_name}`
          : 'Church Admin'
      })) || [];

      setAnnouncements(processedAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      event: 'bg-purple-100 text-purple-800',
      worship: 'bg-indigo-100 text-indigo-800',
      ministry: 'bg-green-100 text-green-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Church Announcements</h2>
        <Badge variant="outline">{announcements.length} announcements</Badge>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No announcements at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={`relative ${announcement.is_pinned ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    {announcement.is_pinned && (
                      <Pin className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(announcement.category)}>
                      {announcement.category}
                    </Badge>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {announcement.author_name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                  </div>
                  {announcement.expires_at && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Calendar className="h-3 w-3" />
                      Expires: {format(new Date(announcement.expires_at), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function DailyBibleVerse() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [verseRef, setVerseRef] = useState('');
  const [verseText, setVerseText] = useState('');
  const [reflection, setReflection] = useState('');

  const canPost = userRole === 'admin' || userRole === 'pastor' || userRole === 'member';

  const { data: todayVerse, isLoading } = useQuery({
    queryKey: ['daily-bible-verse'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_bible_verses')
        .select('*')
        .eq('verse_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const postVerse = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('daily_bible_verses').insert({
        verse_reference: verseRef,
        verse_text: verseText,
        reflection: reflection || null,
        posted_by: user.id,
        verse_date: today,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-bible-verse'] });
      toast({ title: 'Verse Posted', description: "Today's Bible verse has been shared." });
      setOpen(false);
      setVerseRef('');
      setVerseText('');
      setReflection('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message?.includes('unique') 
          ? "A verse has already been posted for today." 
          : 'Failed to post verse.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Daily Bible Verse
        </CardTitle>
        {canPost && !todayVerse && !isLoading && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-3 w-3" /> Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post Today's Bible Verse</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="verse-ref">Verse Reference</Label>
                  <Input
                    id="verse-ref"
                    placeholder="e.g. John 3:16"
                    value={verseRef}
                    onChange={(e) => setVerseRef(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="verse-text">Verse Text</Label>
                  <Textarea
                    id="verse-text"
                    placeholder="Enter the Bible verse..."
                    value={verseText}
                    onChange={(e) => setVerseText(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="reflection">Reflection (optional)</Label>
                  <Textarea
                    id="reflection"
                    placeholder="Share a brief reflection..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={2}
                  />
                </div>
                <Button
                  onClick={() => postVerse.mutate()}
                  disabled={!verseRef.trim() || !verseText.trim() || postVerse.isPending}
                  className="w-full"
                >
                  {postVerse.isPending ? 'Posting...' : 'Post Verse'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ) : todayVerse ? (
          <div className="space-y-2">
            <blockquote className="italic text-foreground/90 border-l-4 border-primary/40 pl-4">
              "{todayVerse.verse_text}"
            </blockquote>
            <p className="text-sm font-semibold text-primary">
              — {todayVerse.verse_reference}
            </p>
            {todayVerse.reflection && (
              <p className="text-sm text-muted-foreground mt-2">
                💭 {todayVerse.reflection}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No verse posted for today yet.
            {canPost && " Click 'Post' to share today's verse."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

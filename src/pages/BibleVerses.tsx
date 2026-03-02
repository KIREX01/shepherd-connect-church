import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';

export default function BibleVerses() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [verseRef, setVerseRef] = useState('');
  const [verseText, setVerseText] = useState('');
  const [reflection, setReflection] = useState('');

  const canPost = userRole === 'admin' || userRole === 'pastor' || userRole === 'member';

  const { data: verses = [], isLoading } = useQuery({
    queryKey: ['bible-verses-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_bible_verses')
        .select('*')
        .order('verse_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const hasTodayVerse = verses.some((v: any) => v.verse_date === today);

  const postVerse = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
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
      queryClient.invalidateQueries({ queryKey: ['bible-verses-history'] });
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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Daily Bible Verses
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              A collection of daily scripture shared with the church
            </p>
          </div>
          {canPost && !hasTodayVerse && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <Plus className="h-4 w-4" /> Post Today's Verse
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
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : verses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No Bible verses have been posted yet.</p>
              {canPost && <p className="text-sm mt-1">Be the first to share a verse!</p>}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {verses.map((verse: any) => (
              <Card
                key={verse.id}
                className={verse.verse_date === today
                  ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
                  : ''}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(verse.verse_date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                    {verse.verse_date === today && (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                        Today
                      </span>
                    )}
                  </div>
                  <blockquote className="italic text-foreground/90 border-l-4 border-primary/40 pl-4 mb-2">
                    "{verse.verse_text}"
                  </blockquote>
                  <p className="text-sm font-semibold text-primary">
                    — {verse.verse_reference}
                  </p>
                  {verse.reflection && (
                    <p className="text-sm text-muted-foreground mt-3">
                      💭 {verse.reflection}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

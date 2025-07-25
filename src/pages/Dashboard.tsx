
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventRegistration } from '@/components/EventRegistration';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { Calendar, Megaphone, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { userRole } = useAuth();
  const [defaultTab, setDefaultTab] = useState('announcements');

  useEffect(() => {
    if (window.location.hash === '#events') {
      setDefaultTab('events');
    } else {
      setDefaultTab('announcements');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Church Dashboard</h1>
              <p className="text-muted-foreground">Stay connected with your church community</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/prayer-requests">
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Prayer Requests
                </Button>
              </Link>
              {(userRole === 'admin' || userRole === 'pastor') && (
                <Link to="/records">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <AnnouncementsList />
          </TabsContent>

          <TabsContent value="events">
            <EventRegistration />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

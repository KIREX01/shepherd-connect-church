
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventRegistration } from '@/components/EventRegistration';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { TithesSummary } from '@/components/TithesSummary';
import { MemberAttendanceSummary } from '@/components/MemberAttendanceSummary';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Calendar, Megaphone, Users, Heart, DollarSign } from 'lucide-react';
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
          <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Church Dashboard</h1>
              <p className="text-muted-foreground">Stay connected with your church community</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/tithes">
                <Button variant="outline" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Tithes</span>
                </Button>
              </Link>
              <Link to="/prayer-requests">
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Prayer Requests</span>
                </Button>
              </Link>
              {(userRole === 'admin' || userRole === 'pastor') && (
                <Link to="/records">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-2">
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
          </div>
          <div className="space-y-6">
            <NotificationSettings />
            <TithesSummary />
            <MemberAttendanceSummary />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

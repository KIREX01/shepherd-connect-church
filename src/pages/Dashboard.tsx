import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventRegistration } from '@/components/EventRegistration';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { TithesSummary } from '@/components/TithesSummary';
import { MemberAttendanceSummary } from '@/components/MemberAttendanceSummary';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Calendar, Megaphone } from 'lucide-react';
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
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Church Dashboard</h1>
        <p className="text-muted-foreground">Stay connected with your church community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue={defaultTab} className="w-full">
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
        </div>
        <div className="space-y-6">
          <NotificationSettings />
          <TithesSummary />
          <MemberAttendanceSummary />
        </div>
      </div>
    </div>
  );
}

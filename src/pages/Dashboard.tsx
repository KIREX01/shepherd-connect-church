import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventRegistration } from '@/components/EventRegistration';
import { AnnouncementsList } from '@/components/AnnouncementsList';
import { TithesSummary } from '@/components/TithesSummary';
import { MemberAttendanceSummary } from '@/components/MemberAttendanceSummary';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Calendar, Megaphone, Users, Heart, DollarSign, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { userRole } = useAuth();
  const [defaultTab, setDefaultTab] = useState('announcements');
  const location = useLocation();

  useEffect(() => {
    if (window.location.hash === '#events') {
      setDefaultTab('events');
    } else {
      setDefaultTab('announcements');
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Shepherd Connect</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/dashboard'}
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/tithes'}
                >
                  <Link to="/tithes">
                    <DollarSign className="h-4 w-4" />
                    Tithes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/prayer-requests'}
                >
                  <Link to="/prayer-requests">
                    <Heart className="h-4 w-4" />
                    Prayer Requests
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {(userRole === 'admin' || userRole === 'pastor') && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/records'}
                  >
                    <Link to="/records">
                      <Users className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          
          <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Church Dashboard</h1>
                  <p className="text-muted-foreground">Stay connected with your church community</p>
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Church, Users, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { userRole } = useAuth();

  // Fetch total members count
  const { data: membersCount = 0 } = useQuery({
    queryKey: ['members-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching members count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: userRole === 'admin' || userRole === 'pastor',
  });

  // Fetch this month's contributions total
  const { data: monthlyContributions = 0 } = useQuery({
    queryKey: ['monthly-contributions'],
    queryFn: async () => {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('contributions')
        .select('amount')
        .gte('contribution_date', firstDayOfMonth.toISOString().split('T')[0])
        .lte('contribution_date', lastDayOfMonth.toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching monthly contributions:', error);
        return 0;
      }

      return data?.reduce((total, contribution) => total + Number(contribution.amount), 0) || 0;
    },
    enabled: userRole === 'admin' || userRole === 'pastor',
  });

  // Fetch upcoming events count (this week)
  const { data: upcomingEvents = 0 } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('event_date', today.toISOString())
        .lte('event_date', nextWeek.toISOString());

      if (error) {
        console.error('Error fetching upcoming events:', error);
        return 0;
      }
      return count || 0;
    },
  });

  // Fetch attendance rate for this month
  const { data: attendanceRate = 0 } = useQuery({
    queryKey: ['attendance-rate'],
    queryFn: async () => {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Get events this month
      const { data: eventsThisMonth, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .gte('event_date', firstDayOfMonth.toISOString())
        .lte('event_date', lastDayOfMonth.toISOString());

      if (eventsError || !eventsThisMonth?.length) {
        return 0;
      }

      const eventIds = eventsThisMonth.map(event => event.id);

      // Get total attendance records for these events
      const { count: totalAttendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .in('event_id', eventIds);

      // Get attended records for these events
      const { count: attendedCount, error: attendedError } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .in('event_id', eventIds)
        .eq('attended', true);

      if (attendanceError || attendedError || !totalAttendance) {
        return 0;
      }

      return totalAttendance > 0 ? Math.round((attendedCount || 0) / totalAttendance * 100) : 0;
    },
    enabled: userRole === 'admin' || userRole === 'pastor',
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membersCount}</div>
              <p className="text-xs text-muted-foreground">
                Active church members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month's Tithes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${monthlyContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Total contributions this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                Average attendance this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks for church management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userRole === 'admin' || userRole === 'pastor' ? (
                <>
                  <Link to="/members">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      View Members
                    </Button>
                  </Link>
                  <Link to="/forms">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Members
                    </Button>
                  </Link>
                  <Link to="/forms">
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Record Contribution
                    </Button>
                  </Link>
                  <Link to="/forms">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Event
                    </Button>
                  </Link>
                  <Link to="/forms">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/forms">
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Make Contribution
                    </Button>
                  </Link>
                  <Link to="/forms">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Events
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates in your church</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity to display</p>
                <p className="text-sm">Activity will appear here as you use the system</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

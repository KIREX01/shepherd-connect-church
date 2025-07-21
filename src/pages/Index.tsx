import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Church, Users, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { userRole } = useAuth();

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
              <div className="text-2xl font-bold">0</div>
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
              <div className="text-2xl font-bold">$0</div>
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
              <div className="text-2xl font-bold">0</div>
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
              <div className="text-2xl font-bold">0%</div>
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
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Calendar, UserCheck, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  membership_date: string | null;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  created_by: string;
  created_at: string;
}

interface Attendance {
  id: string;
  user_id: string;
  event_id: string;
  attended: boolean;
  recorded_by: string;
  recorded_at: string;
  events?: { title: string };
  profiles?: { first_name: string | null; last_name: string | null };
}

interface Contribution {
  id: string;
  user_id: string;
  amount: number;
  contribution_type: string;
  contribution_date: string;
  notes: string | null;
  recorded_by: string;
  created_at: string;
  profiles?: { first_name: string | null; last_name: string | null };
}

export default function Records() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles (members)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch attendance with events
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          *,
          events(title)
        `)
        .order('recorded_at', { ascending: false });

      if (attendanceError) throw attendanceError;

      // Fetch contributions 
      const { data: contributionsData, error: contributionsError } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (contributionsError) throw contributionsError;

      // Fetch all profiles to match with attendance and contributions
      const { data: allProfiles, error: profilesForMatchError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      if (profilesForMatchError) throw profilesForMatchError;

      // Combine attendance data with profile names
      const attendanceWithProfiles = attendanceData?.map(record => ({
        ...record,
        profiles: allProfiles?.find(p => p.user_id === record.user_id) || null
      })) || [];

      // Combine contributions data with profile names  
      const contributionsWithProfiles = contributionsData?.map(record => ({
        ...record,
        profiles: allProfiles?.find(p => p.user_id === record.user_id) || null
      })) || [];

      setProfiles(profilesData || []);
      setEvents(eventsData || []);
      setAttendance(attendanceWithProfiles);
      setContributions(contributionsWithProfiles);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch records data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table: 'profiles' | 'events' | 'attendance' | 'contributions', id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Record deleted successfully",
      });

      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Records Management</h1>
        <p className="text-muted-foreground">Admin Dashboard - Manage all form submissions</p>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({profiles.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Attendance ({attendance.length})
          </TabsTrigger>
          <TabsTrigger value="contributions" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Contributions ({contributions.length})
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Member Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Membership Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        {profile.first_name} {profile.last_name}
                      </TableCell>
                      <TableCell>{profile.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {profile.date_of_birth ? format(new Date(profile.date_of_birth), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {profile.membership_date ? format(new Date(profile.membership_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete('profiles', profile.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>
                        {format(new Date(event.event_date), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{event.location || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {event.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete('events', event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Attendance
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recorded Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.profiles?.first_name} {record.profiles?.last_name}
                      </TableCell>
                      <TableCell>{record.events?.title}</TableCell>
                      <TableCell>
                        <Badge variant={record.attended ? "default" : "secondary"}>
                          {record.attended ? 'Present' : 'Absent'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.recorded_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete('attendance', record.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contributions Tab */}
        <TabsContent value="contributions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Contribution Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contribution
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((contribution) => (
                    <TableRow key={contribution.id}>
                      <TableCell>
                        {contribution.profiles?.first_name} {contribution.profiles?.last_name}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(contribution.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {contribution.contribution_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(contribution.contribution_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {contribution.notes || 'No notes'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete('contributions', contribution.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Users, Calendar, UserCheck, DollarSign, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import type { Tables } from '@/integrations/supabase/types';

type VolunteerRecord = Tables<'volunteer_registrations'>;

interface MemberRegistration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  membership_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  notes: string | null;
  recorded_by: string | null;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  category: string;
  max_attendees: number | null;
  registration_required: boolean;
  cost: number | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_public: boolean;
  requires_childcare: boolean;
  notes: string | null;
  created_by: string;
  created_at: string;
}

interface AttendanceRecord {
  id: string;
  service_date: string;
  service_type: string;
  total_attendance: number;
  adult_count: number;
  child_count: number;
  visitor_count: number;
  first_time_visitors: number;
  special_notes: string | null;
  recorded_by: string;
  created_at: string;
}

interface DonationRecord {
  id: string;
  donor_name: string | null;
  donor_email: string | null;
  donor_phone: string | null;
  amount: number;
  donation_date: string;
  payment_method: string;
  check_number: string | null;
  category: string;
  is_anonymous: boolean;
  is_recurring: boolean;
  tax_deductible: boolean;
  notes: string | null;
  recorded_by: string;
  created_at: string;
}

export default function Records() {
  const [memberRegistrations, setMemberRegistrations] = useState<MemberRegistration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [volunteerRecords, setVolunteerRecords] = useState<VolunteerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Members
      const { data: memberData } = await supabase.from('member_registrations').select('*').order('created_at', { ascending: false });
      setMemberRegistrations(memberData || []);

      // Events
      const { data: eventsData } = await supabase.from('events').select('*').order('event_date', { ascending: false });
      setEvents(eventsData || []);

      // Attendance Records
      const { data: attendanceData } = await supabase
        .from('attendance_records')
        .select('*')
        .order('service_date', { ascending: false });
      setAttendanceRecords(attendanceData || []);

      // Donation Records
      const { data: donationData } = await supabase.from('donation_records').select('*').order('donation_date', { ascending: false });
      setDonationRecords(donationData || []);

      // Volunteer Records
      const { data: volunteerData } = await supabase.from('volunteer_registrations').select('*').order('created_at', { ascending: false });
      setVolunteerRecords((volunteerData as VolunteerRecord[]) || []);
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

  const handleDelete = async (table: 'member_registrations' | 'events' | 'attendance_records' | 'donation_records' | 'volunteer_registrations', id: string) => {
    if (table === 'volunteer_registrations' || table === 'member_registrations' || table === 'events' || table === 'attendance_records' || table === 'donation_records') {
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
    <>
      <Navbar />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Records Management</h1>
          <p className="text-muted-foreground">Admin Dashboard - Manage all form submissions</p>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members ({memberRegistrations.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events ({events.length})
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Attendance ({attendanceRecords.length})
            </TabsTrigger>
            <TabsTrigger value="contributions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Donations ({donationRecords.length})
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Volunteers ({volunteerRecords.length})
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
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Membership Type</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberRegistrations.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          {member.first_name} {member.last_name}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {member.membership_type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(member.date_of_birth), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete('member_registrations', member.id)}
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
                       <TableHead>Date & Time</TableHead>
                       <TableHead>Category</TableHead>
                       <TableHead>Location</TableHead>
                       <TableHead>Contact</TableHead>
                       <TableHead>Cost</TableHead>
                       <TableHead>Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {events.map((event) => (
                       <TableRow key={event.id}>
                         <TableCell className="font-medium">{event.title}</TableCell>
                         <TableCell>
                           <div className="space-y-1">
                             <div>{format(new Date(event.event_date), 'MMM dd, yyyy')}</div>
                             {event.start_time && event.end_time && (
                               <div className="text-sm text-muted-foreground">
                                 {event.start_time} - {event.end_time}
                               </div>
                             )}
                           </div>
                         </TableCell>
                         <TableCell>
                           <Badge variant="outline">
                             {event.category}
                           </Badge>
                         </TableCell>
                         <TableCell>{event.location || 'N/A'}</TableCell>
                         <TableCell>
                           <div className="space-y-1">
                             <div className="text-sm">{event.contact_person || 'N/A'}</div>
                             {event.contact_email && (
                               <div className="text-xs text-muted-foreground">{event.contact_email}</div>
                             )}
                           </div>
                         </TableCell>
                         <TableCell>
                           {event.cost ? `$${Number(event.cost).toFixed(2)}` : 'Free'}
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
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Adults</TableHead>
                      <TableHead>Children</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead>First Time</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                   <TableBody>
                     {attendanceRecords.map((record) => (
                       <TableRow key={record.id}>
                         <TableCell>
                           {format(new Date(record.service_date), 'MMM dd, yyyy')}
                         </TableCell>
                         <TableCell>
                           <Badge variant="outline">
                             {record.service_type.replace('_', ' ')}
                           </Badge>
                         </TableCell>
                         <TableCell className="font-medium">{record.total_attendance}</TableCell>
                         <TableCell>{record.adult_count}</TableCell>
                         <TableCell>{record.child_count}</TableCell>
                         <TableCell>{record.visitor_count}</TableCell>
                         <TableCell>{record.first_time_visitors}</TableCell>
                         <TableCell className="max-w-xs truncate">
                           {record.special_notes || 'No notes'}
                         </TableCell>
                         <TableCell>
                           <div className="flex gap-2">
                             <Button variant="outline" size="sm">
                               <Edit className="h-4 w-4" />
                             </Button>
                             <Button 
                               variant="outline" 
                               size="sm"
                               onClick={() => handleDelete('attendance_records', record.id)}
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

          {/* Donations Tab */}
          <TabsContent value="contributions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Donation Records</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Donation
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donationRecords.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          {donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${Number(donation.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {donation.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {donation.payment_method.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(donation.donation_date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {donation.notes || 'No notes'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete('donation_records', donation.id)}
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

          {/* Volunteers Tab */}
          <TabsContent value="volunteers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Volunteer Records</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Volunteer
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Ministry Areas</TableHead>
                      <TableHead>Emergency Contact</TableHead>
                      <TableHead>Consent</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteerRecords.map((vol) => (
                      <TableRow key={vol.id}>
                        <TableCell>{vol.first_name} {vol.last_name}</TableCell>
                        <TableCell>{vol.email}</TableCell>
                        <TableCell>{vol.phone}</TableCell>
                        <TableCell>{vol.availability.join(', ')}</TableCell>
                        <TableCell>{vol.ministry_areas.join(', ')}</TableCell>
                        <TableCell>
                          {vol.emergency_contact_name}<br/>{vol.emergency_contact_phone}
                        </TableCell>
                        <TableCell>
                          {vol.background_check_consent ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(vol.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete('volunteer_registrations', vol.id)}
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
    </>
  );
}
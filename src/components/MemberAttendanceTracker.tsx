import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, User, Plus, Edit, Trash2, TrendingUp, CalendarDays, Clock3 } from 'lucide-react';
import { format, parseISO, differenceInMinutes } from 'date-fns';

interface MemberAttendance {
  id: string;
  member_id: string;
  member_name: string;
  activity_type: string;
  activity_name: string;
  attendance_date: string;
  check_in_time?: string;
  check_out_time?: string;
  duration_minutes?: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recorded_by: string;
  created_at: string;
}

interface ActivityType {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface AttendanceForm {
  activity_type: string;
  activity_name: string;
  attendance_date: string;
  check_in_time: string;
  check_out_time: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string;
}

export function MemberAttendanceTracker() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<MemberAttendance | null>(null);
  const [form, setForm] = useState<AttendanceForm>({
    activity_type: '',
    activity_name: '',
    attendance_date: '',
    check_in_time: '',
    check_out_time: '',
    status: 'present',
    notes: '',
  });

  // Fetch attendance records based on user role
  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['member-attendance', user?.id],
    queryFn: async () => {
      let query = (supabase as any)
        .from('member_attendance')
        .select('*')
        .order('attendance_date', { ascending: false });
      
      // If user is not admin/pastor, only show their own attendance
      if (userRole !== 'admin' && userRole !== 'pastor') {
        query = query.eq('member_id', user?.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as MemberAttendance[];
    },
  });

  // Fetch activity types
  const { data: activityTypes } = useQuery({
    queryKey: ['activity-types'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('activity_types')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as ActivityType[];
    },
  });

  // Fetch all members for admin/pastor selection
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('first_name');
      if (error) throw error;
      return data;
    },
    enabled: userRole === 'admin' || userRole === 'pastor',
  });

  const createAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: Partial<MemberAttendance>) => {
      const { error } = await (supabase as any).from('member_attendance').insert([attendanceData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-attendance'] });
      toast({ title: 'Success', description: 'Attendance record added successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating attendance:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to add attendance record', 
        variant: 'destructive' 
      });
    },
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MemberAttendance> }) => {
      const { error } = await (supabase as any)
        .from('member_attendance')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-attendance'] });
      toast({ title: 'Success', description: 'Attendance record updated successfully' });
      resetForm();
      setEditingAttendance(null);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating attendance:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update attendance record', 
        variant: 'destructive' 
      });
    },
  });

  const deleteAttendanceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('member_attendance').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member-attendance'] });
      toast({ title: 'Success', description: 'Attendance record deleted successfully' });
    },
    onError: (error) => {
      console.error('Error deleting attendance:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete attendance record', 
        variant: 'destructive' 
      });
    },
  });

  const resetForm = () => {
    setForm({
      activity_type: '',
      activity_name: '',
      attendance_date: format(new Date(), 'yyyy-MM-dd'),
      check_in_time: '',
      check_out_time: '',
      status: 'present',
      notes: '',
    });
  };

  const calculateDuration = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const checkInTime = parseISO(`2000-01-01T${checkIn}`);
    const checkOutTime = parseISO(`2000-01-01T${checkOut}`);
    return differenceInMinutes(checkOutTime, checkInTime);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = calculateDuration(form.check_in_time, form.check_out_time);
    
    const attendanceData = {
      member_id: editingAttendance?.member_id || user?.id,
      member_name: editingAttendance?.member_name || `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
      activity_type: form.activity_type,
      activity_name: form.activity_name,
      attendance_date: form.attendance_date,
      check_in_time: form.check_in_time || null,
      check_out_time: form.check_out_time || null,
      duration_minutes: duration > 0 ? duration : null,
      status: form.status,
      notes: form.notes || null,
      recorded_by: user?.id,
    };

    if (editingAttendance) {
      updateAttendanceMutation.mutate({ id: editingAttendance.id, data: attendanceData });
    } else {
      createAttendanceMutation.mutate(attendanceData);
    }
  };

  const handleEdit = (attendance: MemberAttendance) => {
    setEditingAttendance(attendance);
    setForm({
      activity_type: attendance.activity_type,
      activity_name: attendance.activity_name,
      attendance_date: attendance.attendance_date,
      check_in_time: attendance.check_in_time || '',
      check_out_time: attendance.check_out_time || '',
      status: attendance.status,
      notes: attendance.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      deleteAttendanceMutation.mutate(id);
    }
  };

  // Calculate statistics
  const totalAttendance = attendanceRecords?.length || 0;
  const presentCount = attendanceRecords?.filter(a => a.status === 'present').length || 0;
  const absentCount = attendanceRecords?.filter(a => a.status === 'absent').length || 0;
  const totalHours = attendanceRecords?.reduce((sum, a) => sum + (a.duration_minutes || 0), 0) / 60 || 0;
  
  const currentMonthAttendance = attendanceRecords?.filter(attendance => {
    const attendanceDate = new Date(attendance.attendance_date);
    const now = new Date();
    return attendanceDate.getMonth() === now.getMonth() && attendanceDate.getFullYear() === now.getFullYear();
  }).length || 0;

  const getActivityTypeColor = (activityType: string) => {
    const type = activityTypes?.find(t => t.name === activityType);
    return type?.color || '#3b82f6';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'present':
        return 'default' as const;
      case 'absent':
        return 'destructive' as const;
      case 'late':
        return 'secondary' as const;
      case 'excused':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttendance}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">Times attended</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonthAttendance}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Time spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Attendance Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance Tracker</h2>
          <p className="text-muted-foreground">
            {userRole === 'admin' || userRole === 'pastor' 
              ? 'Track member attendance for all activities' 
              : 'Track your attendance at church activities'
            }
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setEditingAttendance(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAttendance ? 'Edit Attendance' : 'Add New Attendance'}
              </DialogTitle>
              <DialogDescription>
                {editingAttendance ? 'Update the attendance record details.' : 'Record your attendance for a church activity.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activity_type">Activity Type</Label>
                  <Select value={form.activity_type} onValueChange={(value) => setForm({ ...form, activity_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes?.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="attendance_date">Date</Label>
                  <Input
                    id="attendance_date"
                    type="date"
                    value={form.attendance_date}
                    onChange={(e) => setForm({ ...form, attendance_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="activity_name">Activity Name</Label>
                <Input
                  id="activity_name"
                  value={form.activity_name}
                  onChange={(e) => setForm({ ...form, activity_name: e.target.value })}
                  placeholder="e.g., Sunday Service, Bible Study, Choir Practice"
                  required
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="check_in_time">Check In</Label>
                  <Input
                    id="check_in_time"
                    type="time"
                    value={form.check_in_time}
                    onChange={(e) => setForm({ ...form, check_in_time: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="check_out_time">Check Out</Label>
                  <Input
                    id="check_out_time"
                    type="time"
                    value={form.check_out_time}
                    onChange={(e) => setForm({ ...form, check_out_time: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value: any) => setForm({ ...form, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes about the attendance"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAttendanceMutation.isPending || updateAttendanceMutation.isPending}>
                  {createAttendanceMutation.isPending || updateAttendanceMutation.isPending ? 'Saving...' : (editingAttendance ? 'Update' : 'Add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  {(userRole === 'admin' || userRole === 'pastor') && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords?.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{format(new Date(attendance.attendance_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="font-medium">{attendance.activity_name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        style={{ backgroundColor: getActivityTypeColor(attendance.activity_type) + '20', borderColor: getActivityTypeColor(attendance.activity_type) }}
                      >
                        {attendance.activity_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {attendance.check_in_time && attendance.check_out_time ? (
                        <div className="text-sm">
                          <div>{attendance.check_in_time}</div>
                          <div className="text-muted-foreground">to {attendance.check_out_time}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No time recorded</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {attendance.duration_minutes ? (
                        <span>{Math.floor(attendance.duration_minutes / 60)}h {attendance.duration_minutes % 60}m</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(attendance.status)}>
                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {attendance.notes || '-'}
                    </TableCell>
                    {(userRole === 'admin' || userRole === 'pastor') && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(attendance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(attendance.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {attendanceRecords?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={userRole === 'admin' || userRole === 'pastor' ? 8 : 7} className="text-center py-8">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
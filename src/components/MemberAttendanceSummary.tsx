import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MemberAttendance {
  id: string;
  attendance_date: string;
  activity_type: string;
  status: string;
  duration_minutes?: number;
}

export function MemberAttendanceSummary() {
  const { user, userRole } = useAuth();

  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['member-attendance-summary', user?.id],
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAttendance = attendanceRecords?.length || 0;
  const presentCount = attendanceRecords?.filter(a => a.status === 'present').length || 0;
  const totalHours = attendanceRecords?.reduce((sum, a) => sum + (a.duration_minutes || 0), 0) / 60 || 0;
  
  const currentMonthAttendance = attendanceRecords?.filter(attendance => {
    const attendanceDate = new Date(attendance.attendance_date);
    const now = new Date();
    return attendanceDate.getMonth() === now.getMonth() && attendanceDate.getFullYear() === now.getFullYear();
  }).length || 0;

  const lastMonthAttendance = attendanceRecords?.filter(attendance => {
    const attendanceDate = new Date(attendance.attendance_date);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return attendanceDate.getMonth() === lastMonth.getMonth() && attendanceDate.getFullYear() === lastMonth.getFullYear();
  }).length || 0;

  const monthOverMonthChange = lastMonthAttendance > 0 
    ? ((currentMonthAttendance - lastMonthAttendance) / lastMonthAttendance) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Attendance Tracker</span>
          <Link to="/member-attendance">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold">{totalAttendance}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Present</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">Times attended</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold">{currentMonthAttendance}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-3 w-3 ${monthOverMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs ${monthOverMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Hours</span>
            </div>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Time spent</p>
          </div>
        </div>
        
        {attendanceRecords && attendanceRecords.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {attendanceRecords.slice(0, 3).map((attendance) => (
                <div key={attendance.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{new Date(attendance.attendance_date).toLocaleDateString()}</span>
                  </div>
                  <span className="font-medium">{attendance.activity_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { MemberAttendanceTracker } from '@/components/MemberAttendanceTracker';
import { Navbar } from '@/components/Navbar';

export default function MemberAttendance() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Attendance</h1>
            <p className="text-muted-foreground mt-2">
              Track attendance for church activities, events, and ministry programs.
            </p>
          </div>
          
          <MemberAttendanceTracker />
        </div>
      </div>
    </div>
  );
} 
import { MemberAttendanceTracker } from '@/components/MemberAttendanceTracker';

export default function MemberAttendance() {
  return (
    <div className="p-4 md:p-8">
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
  );
}
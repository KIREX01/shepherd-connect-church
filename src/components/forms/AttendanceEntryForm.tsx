import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const attendanceSchema = z.object({
  serviceDate: z.date({
    required_error: "Service date is required",
  }),
  serviceType: z.enum(["sunday_morning", "sunday_evening", "wednesday", "special_event"]),
  totalAttendance: z.number().min(1, "Total attendance must be at least 1"),
  adultCount: z.number().min(0, "Adult count cannot be negative"),
  childCount: z.number().min(0, "Child count cannot be negative"),
  visitorCount: z.number().min(0, "Visitor count cannot be negative"),
  firstTimeVisitors: z.number().min(0, "First time visitors cannot be negative"),
  memberAttendance: z.array(z.string()).optional(),
  specialNotes: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

// Mock member data - in real app, this would come from the database
const mockMembers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Brown" },
  { id: "5", name: "Charlie Wilson" },
];

export function AttendanceEntryForm() {
  const { toast } = useToast();
  
  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      serviceDate: new Date(),
      adultCount: 0,
      childCount: 0,
      visitorCount: 0,
      firstTimeVisitors: 0,
      memberAttendance: [],
    },
  });

  const watchedCounts = form.watch(["adultCount", "childCount", "visitorCount"]);
  const calculatedTotal = watchedCounts.reduce((sum, count) => sum + (count || 0), 0);

  // Auto-update total attendance when individual counts change
  React.useEffect(() => {
    form.setValue("totalAttendance", calculatedTotal);
  }, [calculatedTotal, form]);

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const recordedBy = user ? user.id : null;

      if (!recordedBy) {
        throw new Error("User not authenticated");
      }

      const attendancePayload = {
        service_date: data.serviceDate.toISOString().split('T')[0],
        service_type: data.serviceType,
        total_attendance: data.totalAttendance,
        adult_count: data.adultCount,
        child_count: data.childCount,
        visitor_count: data.visitorCount,
        first_time_visitors: data.firstTimeVisitors,
        special_notes: data.specialNotes || null,
        recorded_by: recordedBy,
      };

      const { error } = await supabase
        .from("attendance_records")
        .insert([attendancePayload]);

      if (error) {
        throw error;
      }

      toast({
        title: "Attendance recorded successfully",
        description: `${data.totalAttendance} attendees recorded for ${format(data.serviceDate, "PPP")}.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Attendance Entry
        </CardTitle>
        <CardDescription>
          Record attendance for church services and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serviceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Service Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sunday_morning">Sunday Morning</SelectItem>
                        <SelectItem value="sunday_evening">Sunday Evening</SelectItem>
                        <SelectItem value="wednesday">Wednesday Service</SelectItem>
                        <SelectItem value="special_event">Special Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="adultCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adults</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="childCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Children</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visitorCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visitors</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firstTimeVisitors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Time</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="totalAttendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Attendance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memberAttendance"
              render={() => (
                <FormItem>
                  <FormLabel>Member Attendance</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                    {mockMembers.map((member) => (
                      <FormField
                        key={member.id}
                        control={form.control}
                        name="memberAttendance"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={member.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(member.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), member.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== member.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {member.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Any special notes about this service..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Record Attendance
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
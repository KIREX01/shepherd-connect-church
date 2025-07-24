"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { UserCheck } from "lucide-react"
import type { Tables } from "@/types/supabase"

const attendanceSchema = z.object({
  eventId: z.string().min(1, "Please select an event"),
  memberId: z.string().min(1, "Please select a member"),
  attended: z.boolean().default(true),
})

type AttendanceFormData = z.infer<typeof attendanceSchema>

export function AttendanceEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [events, setEvents] = useState<Tables<"events">[]>([])
  const [members, setMembers] = useState<Tables<"members">[]>([])
  const { toast } = useToast()

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      eventId: "",
      memberId: "",
      attended: true,
    },
  })

  useEffect(() => {
    fetchEvents()
    fetchMembers()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_date")
        .order("event_date", { ascending: false })
        .limit(20)

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("members").select("id, first_name, last_name").order("first_name")

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  const onSubmit = async (data: AttendanceFormData) => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: data.eventId,
        member_id: data.memberId,
        attended: data.attended,
        registration_date: new Date().toISOString().split("T")[0],
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Attendance has been recorded successfully.",
      })

      form.reset()
    } catch (error) {
      console.error("Error recording attendance:", error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Attendance Entry
        </CardTitle>
        <CardDescription>Record member attendance for events</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title} - {new Date(event.event_date).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attended"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Attended</FormLabel>
                    <p className="text-sm text-muted-foreground">Check if the member attended this event</p>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Recording Attendance..." : "Record Attendance"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

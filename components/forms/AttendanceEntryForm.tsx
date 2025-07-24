"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function AttendanceEntryForm() {
  const [formData, setFormData] = useState({
    event_id: "",
    member_id: "",
    attendance_date: "",
    status: "present",
  })
  const [events, setEvents] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventsData, error: eventsError } = await supabase.from("events").select("id, name")
      if (eventsError) {
        toast.error("Error fetching events: " + eventsError.message)
      } else {
        setEvents(eventsData)
      }

      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, first_name, last_name")
      if (membersError) {
        toast.error("Error fetching members: " + membersError.message)
      } else {
        setMembers(membersData)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("attendance").insert([formData])

    if (error) {
      toast.error("Error recording attendance: " + error.message)
    } else {
      toast.success("Attendance recorded successfully!")
      setFormData({
        event_id: "",
        member_id: "",
        attendance_date: "",
        status: "present",
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="event_id">Event</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "event_id")} value={formData.event_id}>
          <SelectTrigger>
            <SelectValue placeholder="Select event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="member_id">Member</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "member_id")} value={formData.member_id}>
          <SelectTrigger>
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="attendance_date">Attendance Date</Label>
        <Input id="attendance_date" type="date" value={formData.attendance_date} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "status")} value={formData.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="excused">Excused</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="md:col-span-2" disabled={loading}>
        {loading ? "Recording..." : "Record Attendance"}
      </Button>
    </form>
  )
}

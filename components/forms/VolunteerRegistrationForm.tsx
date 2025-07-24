"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/types/supabase"

export default function VolunteerRegistrationForm() {
  const [memberId, setMemberId] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [role, setRole] = useState("")
  const [members, setMembers] = useState<Database["public"]["Tables"]["members"]["Row"][]>([])
  const [events, setEvents] = useState<Database["public"]["Tables"]["events"]["Row"][]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, first_name, last_name")
      const { data: eventsData, error: eventsError } = await supabase.from("events").select("id, name, date")

      if (membersError) {
        toast({ title: "Error fetching members", description: membersError.message, variant: "destructive" })
      } else {
        setMembers(membersData || [])
      }

      if (eventsError) {
        toast({ title: "Error fetching events", description: eventsError.message, variant: "destructive" })
      } else {
        setEvents(eventsData || [])
      }
    }
    fetchData()
  }, [supabase, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!memberId || !eventId || !role) {
      toast({
        title: "Missing Information",
        description: "Please select a member, an event, and a role.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from("volunteers").insert([
      {
        member_id: memberId,
        event_id: eventId,
        role,
      },
    ])

    if (error) {
      toast({
        title: "Error registering volunteer",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Volunteer registered successfully!",
        description: "The volunteer has been added to the database.",
      })
      // Clear form
      setMemberId(null)
      setEventId(null)
      setRole("")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="member">Member</Label>
        <Select value={memberId || ""} onValueChange={setMemberId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a member" />
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
      <div>
        <Label htmlFor="event">Event</Label>
        <Select value={eventId || ""} onValueChange={setEventId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an event" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name} ({event.date})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Registering..." : "Register Volunteer"}
      </Button>
    </form>
  )
}

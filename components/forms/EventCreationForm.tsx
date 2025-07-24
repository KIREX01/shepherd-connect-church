"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import type { Database } from "@/types/supabase"

export default function EventCreationForm() {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("events").insert([
      {
        name,
        date,
        time,
        location,
        description,
      },
    ])

    if (error) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Event created successfully!",
        description: "The new event has been added to the database.",
      })
      // Clear form
      setName("")
      setDate("")
      setTime("")
      setLocation("")
      setDescription("")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="eventName">Event Name</Label>
        <Input id="eventName" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="eventDate">Date</Label>
        <Input id="eventDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="eventTime">Time</Label>
        <Input id="eventTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="eventLocation">Location</Label>
        <Input id="eventLocation" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="eventDescription">Description</Label>
        <Textarea id="eventDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </Button>
    </form>
  )
}

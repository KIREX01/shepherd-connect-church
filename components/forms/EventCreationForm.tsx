"use client"

import type React from "react"

import { useState, useEffect } from "react"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/types/supabase"

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  ministryId: z.string().optional(),
  registrationRequired: z.boolean().default(false),
  registrationDeadline: z.string().optional(),
  maxAttendees: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

export default function EventCreationForm() {
  const [formData, setFormData] = useState({
    name: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    description: "",
    ministryId: "",
    registrationRequired: false,
    registrationDeadline: "",
    maxAttendees: "",
  })
  const [loading, setLoading] = useState(false)
  const [ministries, setMinistries] = useState<Tables<"ministries">[]>([])

  useEffect(() => {
    fetchMinistries()
  }, [])

  const fetchMinistries = async () => {
    try {
      const { data, error } = await supabase.from("ministries").select("id, name").eq("is_active", true).order("name")

      if (error) throw error
      setMinistries(data || [])
    } catch (error) {
      console.error("Error fetching ministries:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("events").insert([formData])

    if (error) {
      toast.error("Error creating event: " + error.message)
    } else {
      toast.success("Event created successfully!")
      setFormData({
        name: "",
        event_date: "",
        start_time: "",
        end_time: "",
        location: "",
        description: "",
        ministryId: "",
        registrationRequired: false,
        registrationDeadline: "",
        maxAttendees: "",
      })
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Event Creation</CardTitle>
        <CardDescription>Create a new church event or activity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <FormLabel htmlFor="name">Event Name</FormLabel>
            <Input id="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="event_date">Date</FormLabel>
            <Input id="event_date" type="date" value={formData.event_date} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="start_time">Start Time</FormLabel>
            <Input id="start_time" type="time" value={formData.start_time} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="end_time">End Time</FormLabel>
            <Input id="end_time" type="time" value={formData.end_time} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input id="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea id="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel htmlFor="ministryId">Ministry</FormLabel>
              <Select
                onValueChange={(value) => handleChange({ target: { id: "ministryId", value } })}
                defaultValue={formData.ministryId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ministries.map((ministry) => (
                    <SelectItem key={ministry.id} value={ministry.id}>
                      {ministry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="registrationRequired">Registration Required</FormLabel>
              <Checkbox
                checked={formData.registrationRequired}
                onCheckedChange={(value) => handleChange({ target: { id: "registrationRequired", value } })}
              />
            </div>
          </div>
          {formData.registrationRequired && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel htmlFor="registrationDeadline">Registration Deadline</FormLabel>
                <Input
                  id="registrationDeadline"
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <FormLabel htmlFor="maxAttendees">Max Attendees</FormLabel>
                <Input
                  id="maxAttendees"
                  type="number"
                  placeholder="Enter maximum number of attendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          <Button type="submit" className="md:col-span-2" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useEffect } from "react"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/types/supabase"

const ministrySchema = z.object({
  name: z.string().min(1, "Ministry name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  leaderId: z.string().optional(),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  meetingLocation: z.string().optional(),
  isActive: z.boolean().default(true),
})

type MinistryFormData = z.infer<typeof ministrySchema>

export default function MinistryCreationForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    leaderId: "",
    meetingDay: "",
    meetingTime: "",
    meetingLocation: "",
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<Tables<"members">[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("ministries").insert([formData])

    if (error) {
      toast.error("Error creating ministry: " + error.message)
    } else {
      toast.success("Ministry created successfully!")
      setFormData({
        name: "",
        description: "",
        category: "",
        leaderId: "",
        meetingDay: "",
        meetingTime: "",
        meetingLocation: "",
        is_active: true,
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("members").select("id, first_name, last_name").order("first_name")

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Ministry Creation</CardTitle>
        <CardDescription>Create a new ministry or program</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ministry Name *</Label>
            <Input id="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                defaultValue={formData.category}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="worship">Worship</SelectItem>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="children">Children</SelectItem>
                  <SelectItem value="outreach">Outreach</SelectItem>
                  <SelectItem value="discipleship">Discipleship</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="missions">Missions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leaderId">Leader</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, leaderId: value }))}
                defaultValue={formData.leaderId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leader" />
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
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingDay">Meeting Day</Label>
              <Select
                onValueChange={(value) => setFormData((prev) => ({ ...prev, meetingDay: value }))}
                defaultValue={formData.meetingDay}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time</Label>
              <Input type="time" id="meetingTime" value={formData.meetingTime} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meetingLocation">Meeting Location</Label>
              <Input
                id="meetingLocation"
                value={formData.meetingLocation}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="is_active">Active Ministry</Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Ministry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

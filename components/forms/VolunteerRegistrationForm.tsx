"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function VolunteerRegistrationForm() {
  const [formData, setFormData] = useState({
    member_id: "",
    ministry_id: "",
    role: "",
    start_date: "",
    end_date: "",
    notes: "",
  })
  const [members, setMembers] = useState<any[]>([])
  const [ministries, setMinistries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("id, first_name, last_name")
      if (membersError) {
        toast.error("Error fetching members: " + membersError.message)
      } else {
        setMembers(membersData)
      }

      const { data: ministriesData, error: ministriesError } = await supabase.from("ministries").select("id, name")
      if (ministriesError) {
        toast.error("Error fetching ministries: " + ministriesError.message)
      } else {
        setMinistries(ministriesData)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("volunteer_assignments").insert([formData])

    if (error) {
      toast.error("Error registering volunteer: " + error.message)
    } else {
      toast.success("Volunteer registered successfully!")
      setFormData({
        member_id: "",
        ministry_id: "",
        role: "",
        start_date: "",
        end_date: "",
        notes: "",
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="ministry_id">Ministry</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "ministry_id")} value={formData.ministry_id}>
          <SelectTrigger>
            <SelectValue placeholder="Select ministry" />
          </SelectTrigger>
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
        <Label htmlFor="role">Role in Ministry</Label>
        <Input id="role" value={formData.role} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date</Label>
        <Input id="start_date" type="date" value={formData.start_date} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end_date">End Date (Optional)</Label>
        <Input id="end_date" type="date" value={formData.end_date} onChange={handleChange} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <Button type="submit" className="md:col-span-2" disabled={loading}>
        {loading ? "Registering..." : "Register Volunteer"}
      </Button>
    </form>
  )
}

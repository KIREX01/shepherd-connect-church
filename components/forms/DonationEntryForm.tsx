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

export default function DonationEntryForm() {
  const [formData, setFormData] = useState({
    member_id: "",
    amount: "",
    donation_date: "",
    type: "",
    notes: "",
  })
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase.from("members").select("id, first_name, last_name")
      if (error) {
        toast.error("Error fetching members: " + error.message)
      } else {
        setMembers(data)
      }
    }
    fetchMembers()
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

    const { data, error } = await supabase.from("donations").insert([
      {
        member_id: formData.member_id || null, // Allow null for anonymous donations
        amount: Number.parseFloat(formData.amount),
        donation_date: formData.donation_date,
        type: formData.type,
        notes: formData.notes,
      },
    ])

    if (error) {
      toast.error("Error recording donation: " + error.message)
    } else {
      toast.success("Donation recorded successfully!")
      setFormData({
        member_id: "",
        amount: "",
        donation_date: "",
        type: "",
        notes: "",
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="member_id">Member (Optional, for anonymous donations leave blank)</Label>
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
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="donation_date">Donation Date</Label>
        <Input id="donation_date" type="date" value={formData.donation_date} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "type")} value={formData.type}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tithe">Tithe</SelectItem>
            <SelectItem value="Offering">Offering</SelectItem>
            <SelectItem value="Building Fund">Building Fund</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={formData.notes} onChange={handleChange} />
      </div>
      <Button type="submit" className="md:col-span-2" disabled={loading}>
        {loading ? "Recording..." : "Record Donation"}
      </Button>
    </form>
  )
}

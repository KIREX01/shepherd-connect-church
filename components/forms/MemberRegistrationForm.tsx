"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function MemberRegistrationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    gender: "",
    membership_date: "",
    is_active: true,
    role: "member",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("members").insert([formData])

    if (error) {
      toast.error("Error registering member: " + error.message)
    } else {
      toast.success("Member registered successfully!")
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        date_of_birth: "",
        gender: "",
        membership_date: "",
        is_active: true,
        role: "member",
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="first_name">First Name</Label>
        <Input id="first_name" value={formData.first_name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="last_name">Last Name</Label>
        <Input id="last_name" value={formData.last_name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input id="phone_number" value={formData.phone_number} onChange={handleChange} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" value={formData.address} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input id="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "gender")} value={formData.gender}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="membership_date">Membership Date</Label>
        <Input id="membership_date" type="date" value={formData.membership_date} onChange={handleChange} required />
      </div>
      <div className="flex items-center space-x-2 md:col-span-2">
        <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={handleCheckboxChange} />
        <Label htmlFor="is_active">Active Member</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => handleSelectChange(value, "role")} value={formData.role}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="md:col-span-2" disabled={loading}>
        {loading ? "Registering..." : "Register Member"}
      </Button>
    </form>
  )
}

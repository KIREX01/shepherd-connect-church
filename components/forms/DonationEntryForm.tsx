"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Database } from "@/types/supabase"

export default function DonationEntryForm() {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")
  const [notes, setNotes] = useState("")
  const [memberId, setMemberId] = useState<string | null>(null)
  const [members, setMembers] = useState<Database["public"]["Tables"]["members"]["Row"][]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase.from("members").select("id, first_name, last_name")
      if (error) {
        toast({
          title: "Error fetching members",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setMembers(data)
      }
    }
    fetchMembers()
  }, [supabase, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("donations").insert([
      {
        amount: Number.parseFloat(amount),
        type,
        notes,
        member_id: memberId,
      },
    ])

    if (error) {
      toast({
        title: "Error recording donation",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Donation recorded successfully!",
        description: "The donation has been added to the database.",
      })
      // Clear form
      setAmount("")
      setType("")
      setNotes("")
      setMemberId(null)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Input id="type" value={type} onChange={(e) => setType(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="member">Member (Optional)</Label>
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
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Recording..." : "Record Donation"}
      </Button>
    </form>
  )
}

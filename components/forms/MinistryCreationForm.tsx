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

export default function MinistryCreationForm() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.from("ministries").insert([
      {
        name,
        description,
      },
    ])

    if (error) {
      toast({
        title: "Error creating ministry",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Ministry created successfully!",
        description: "The new ministry has been added to the database.",
      })
      // Clear form
      setName("")
      setDescription("")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="ministryName">Ministry Name</Label>
        <Input id="ministryName" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="ministryDescription">Description</Label>
        <Textarea id="ministryDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Ministry"}
      </Button>
    </form>
  )
}

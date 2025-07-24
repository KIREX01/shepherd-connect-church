"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Church } from "lucide-react"
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

export function MinistryCreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [members, setMembers] = useState<Tables<"members">[]>([])
  const { toast } = useToast()

  const form = useForm<MinistryFormData>({
    resolver: zodResolver(ministrySchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      leaderId: "",
      meetingDay: "",
      meetingTime: "",
      meetingLocation: "",
      isActive: true,
    },
  })

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

  const onSubmit = async (data: MinistryFormData) => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("ministries").insert({
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        leader_id: data.leaderId || null,
        meeting_day: data.meetingDay || null,
        meeting_time: data.meetingTime || null,
        meeting_location: data.meetingLocation || null,
        is_active: data.isActive,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Ministry has been created successfully.",
      })

      form.reset()
      form.setValue("isActive", true)
    } catch (error) {
      console.error("Error creating ministry:", error)
      toast({
        title: "Error",
        description: "Failed to create ministry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Church className="h-5 w-5" />
          Ministry Creation
        </CardTitle>
        <CardDescription>Create a new ministry or program</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ministry Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ministry name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter ministry description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leader</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="meetingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active Ministry</FormLabel>
                    <p className="text-sm text-muted-foreground">Check if this ministry is currently active</p>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Ministry..." : "Create Ministry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

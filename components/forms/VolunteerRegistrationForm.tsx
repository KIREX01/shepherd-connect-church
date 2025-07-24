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
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Heart } from "lucide-react"
import type { Tables } from "@/types/supabase"

const volunteerSchema = z.object({
  volunteerId: z.string().min(1, "Please select a volunteer"),
  volunteerRoleId: z.string().min(1, "Please select a role"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
})

type VolunteerFormData = z.infer<typeof volunteerSchema>

export function VolunteerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [members, setMembers] = useState<Tables<"members">[]>([])
  const [volunteerRoles, setVolunteerRoles] = useState<Tables<"volunteer_roles">[]>([])
  const { toast } = useToast()

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      volunteerId: "",
      volunteerRoleId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "active",
      notes: "",
    },
  })

  useEffect(() => {
    fetchMembers()
    fetchVolunteerRoles()
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

  const fetchVolunteerRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("volunteer_roles")
        .select("id, role_name, description")
        .eq("is_active", true)
        .order("role_name")

      if (error) throw error
      setVolunteerRoles(data || [])
    } catch (error) {
      console.error("Error fetching volunteer roles:", error)
    }
  }

  const onSubmit = async (data: VolunteerFormData) => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("volunteer_assignments").insert({
        volunteer_id: data.volunteerId,
        volunteer_role_id: data.volunteerRoleId,
        assignment_date: new Date().toISOString().split("T")[0],
        start_date: data.startDate,
        end_date: data.endDate || null,
        status: data.status,
        notes: data.notes || null,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Volunteer assignment has been created successfully.",
      })

      form.reset()
      form.setValue("startDate", new Date().toISOString().split("T")[0])
      form.setValue("status", "active")
    } catch (error) {
      console.error("Error creating volunteer assignment:", error)
      toast({
        title: "Error",
        description: "Failed to create volunteer assignment. Please try again.",
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
          <Heart className="h-5 w-5" />
          Volunteer Registration
        </CardTitle>
        <CardDescription>Assign volunteers to ministry roles</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="volunteerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volunteer *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a volunteer" />
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

            <FormField
              control={form.control}
              name="volunteerRoleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {volunteerRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.role_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes about this volunteer assignment"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Assignment..." : "Create Assignment"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

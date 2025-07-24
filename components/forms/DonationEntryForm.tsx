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
import { DollarSign } from "lucide-react"
import type { Tables } from "@/types/supabase"

const donationSchema = z.object({
  memberId: z.string().min(1, "Please select a member"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  donationType: z.string().min(1, "Donation type is required"),
  fundDesignation: z.string().optional(),
  donationDate: z.string().min(1, "Donation date is required"),
  paymentMethod: z.string().optional(),
  receiptNumber: z.string().optional(),
  taxDeductible: z.boolean().default(true),
  notes: z.string().optional(),
})

type DonationFormData = z.infer<typeof donationSchema>

export function DonationEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [members, setMembers] = useState<Tables<"members">[]>([])
  const { toast } = useToast()

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      memberId: "",
      amount: "",
      donationType: "",
      fundDesignation: "general",
      donationDate: new Date().toISOString().split("T")[0],
      paymentMethod: "",
      receiptNumber: "",
      taxDeductible: true,
      notes: "",
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
      toast({
        title: "Error",
        description: "Failed to load members list",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: DonationFormData) => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("donations").insert({
        member_id: data.memberId,
        amount: Number(data.amount),
        donation_type: data.donationType,
        fund_designation: data.fundDesignation || null,
        donation_date: data.donationDate,
        payment_method: data.paymentMethod || null,
        receipt_number: data.receiptNumber || null,
        tax_deductible: data.taxDeductible,
        notes: data.notes || null,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Donation has been recorded successfully.",
      })

      form.reset()
      form.setValue("donationDate", new Date().toISOString().split("T")[0])
      form.setValue("taxDeductible", true)
    } catch (error) {
      console.error("Error recording donation:", error)
      toast({
        title: "Error",
        description: "Failed to record donation. Please try again.",
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
          <DollarSign className="h-5 w-5" />
          Donation Entry
        </CardTitle>
        <CardDescription>Record a new donation or contribution</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="donationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tithe">Tithe</SelectItem>
                        <SelectItem value="offering">Offering</SelectItem>
                        <SelectItem value="special_offering">Special Offering</SelectItem>
                        <SelectItem value="building_fund">Building Fund</SelectItem>
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
                name="fundDesignation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fund Designation</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fund" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        <SelectItem value="building">Building Fund</SelectItem>
                        <SelectItem value="missions">Missions Fund</SelectItem>
                        <SelectItem value="youth">Youth Ministry</SelectItem>
                        <SelectItem value="music">Music Ministry</SelectItem>
                        <SelectItem value="outreach">Outreach</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiptNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter receipt number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="taxDeductible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tax Deductible</FormLabel>
                    <p className="text-sm text-muted-foreground">Check if this donation is tax deductible</p>
                  </div>
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
                      placeholder="Enter any additional notes about this donation"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Recording Donation..." : "Record Donation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

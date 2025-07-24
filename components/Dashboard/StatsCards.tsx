"use client"

import { useQuery } from "@tanstack/react-query"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Calendar, Church } from "lucide-react"

export function StatsCards() {
  const supabase = createClientComponentClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [membersResult, donationsResult, eventsResult, ministriesResult] = await Promise.all([
        supabase.from("members").select("id", { count: "exact" }),
        supabase.from("donations").select("amount"),
        supabase.from("events").select("id", { count: "exact" }),
        supabase.from("ministries").select("id", { count: "exact" }),
      ])

      const totalDonations = donationsResult.data?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0

      return {
        totalMembers: membersResult.count || 0,
        totalDonations,
        totalEvents: eventsResult.count || 0,
        totalMinistries: ministriesResult.count || 0,
      }
    },
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
          <p className="text-xs text-muted-foreground">Registered church members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.totalDonations?.toFixed(2) || "0.00"}</div>
          <p className="text-xs text-muted-foreground">All-time contributions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
          <p className="text-xs text-muted-foreground">Scheduled events</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Ministries</CardTitle>
          <Church className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalMinistries || 0}</div>
          <p className="text-xs text-muted-foreground">Church ministries</p>
        </CardContent>
      </Card>
    </div>
  )
}

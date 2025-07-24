"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Calendar, Church } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

interface ChurchStats {
  totalMembers: number
  totalDonations: number
  upcomingEvents: number
  activeMinistries: number
}

export function StatsCards() {
  const [stats, setStats] = useState<ChurchStats>({
    totalMembers: 0,
    totalDonations: 0,
    upcomingEvents: 0,
    activeMinistries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get total members
      const { count: membersCount } = await supabase.from("members").select("*", { count: "exact", head: true })

      // Get total donations this month
      const firstDayOfMonth = new Date()
      firstDayOfMonth.setDate(1)
      firstDayOfMonth.setHours(0, 0, 0, 0)

      const { data: donations } = await supabase
        .from("donations")
        .select("amount")
        .gte("donation_date", firstDayOfMonth.toISOString())

      const totalDonations = donations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0

      // Get upcoming events (next 30 days)
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

      const { count: eventsCount } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .gte("event_date", new Date().toISOString())
        .lte("event_date", thirtyDaysFromNow.toISOString())

      // Get active ministries
      const { count: ministriesCount } = await supabase
        .from("ministries")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)

      setStats({
        totalMembers: membersCount || 0,
        totalDonations,
        upcomingEvents: eventsCount || 0,
        activeMinistries: ministriesCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <div className="text-2xl font-bold">{stats.totalMembers}</div>
          <p className="text-xs text-muted-foreground">Registered church members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalDonations.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">This month's contributions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
          <p className="text-xs text-muted-foreground">Next 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Ministries</CardTitle>
          <Church className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeMinistries}</div>
          <p className="text-xs text-muted-foreground">Currently active programs</p>
        </CardContent>
      </Card>
    </div>
  )
}

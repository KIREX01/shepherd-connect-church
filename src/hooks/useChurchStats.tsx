"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

interface ChurchStats {
  totalMembers: number
  upcomingEvents: number
  monthlyDonations: number
  attendanceRate: number
  loading: boolean
  error: string | null
}

export function useChurchStats(): ChurchStats {
  const [stats, setStats] = useState<ChurchStats>({
    totalMembers: 0,
    upcomingEvents: 0,
    monthlyDonations: 0,
    attendanceRate: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total members
        const { count: membersCount } = await supabase
          .from("member_registrations")
          .select("*", { count: "exact", head: true })

        // Get upcoming events (next 30 days)
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        const { count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("event_date", new Date().toISOString())
          .lte("event_date", thirtyDaysFromNow.toISOString())

        // Get monthly donations
        const firstDayOfMonth = new Date()
        firstDayOfMonth.setDate(1)
        firstDayOfMonth.setHours(0, 0, 0, 0)

        const { data: donations } = await supabase
          .from("contributions")
          .select("amount")
          .gte("contribution_date", firstDayOfMonth.toISOString())

        const monthlyTotal = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0

        // Calculate attendance rate (simplified - you might want to make this more sophisticated)
        const { data: attendanceData } = await supabase
          .from("attendance")
          .select("attended")
          .gte("recorded_at", firstDayOfMonth.toISOString())

        const attendanceRate = attendanceData?.length
          ? Math.round((attendanceData.filter((a) => a.attended).length / attendanceData.length) * 100)
          : 0

        setStats({
          totalMembers: membersCount || 0,
          upcomingEvents: eventsCount || 0,
          monthlyDonations: monthlyTotal,
          attendanceRate,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error("Error fetching church stats:", error)
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load statistics",
        }))
      }
    }

    fetchStats()
  }, [])

  return stats
}

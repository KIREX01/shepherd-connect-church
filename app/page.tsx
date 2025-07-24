import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Calendar, Church } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Server-side Supabase client for data fetching
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function getDashboardStats() {
  const { count: totalMembers, error: membersError } = await supabaseAdmin
    .from("members")
    .select("*", { count: "exact" })

  const { count: totalEvents, error: eventsError } = await supabaseAdmin.from("events").select("*", { count: "exact" })

  const { data: totalDonationsData, error: donationsError } = await supabaseAdmin.from("donations").select("amount")

  const { count: totalMinistries, error: ministriesError } = await supabaseAdmin
    .from("ministries")
    .select("*", { count: "exact" })

  if (membersError) console.error("Error fetching total members:", membersError)
  if (eventsError) console.error("Error fetching total events:", eventsError)
  if (donationsError) console.error("Error fetching total donations:", donationsError)
  if (ministriesError) console.error("Error fetching total ministries:", ministriesError)

  const totalDonationAmount = totalDonationsData
    ? totalDonationsData.reduce((sum, donation) => sum + (donation.amount || 0), 0)
    : 0

  return {
    totalMembers: totalMembers || 0,
    totalEvents: totalEvents || 0,
    totalDonationAmount: totalDonationAmount,
    totalMinistries: totalMinistries || 0,
  }
}

export default async function DashboardPage() {
  const { totalMembers, totalEvents, totalDonationAmount, totalMinistries } = await getDashboardStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMembers}</div>
          <p className="text-xs text-muted-foreground">Registered members</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEvents}</div>
          <p className="text-xs text-muted-foreground">Upcoming and past events</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalDonationAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total contributions received</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ministries</CardTitle>
          <Church className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMinistries}</div>
          <p className="text-xs text-muted-foreground">Active church ministries</p>
        </CardContent>
      </Card>
    </div>
  )
}

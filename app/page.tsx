import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Calendar, Handshake } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: membersCountData, error: membersCountError } = await supabase
    .from("members")
    .select("id", { count: "exact" })

  const { data: totalDonationsData, error: totalDonationsError } = await supabase.from("donations").select("amount")

  const { data: upcomingEventsData, error: upcomingEventsError } = await supabase
    .from("events")
    .select("id")
    .gte("event_date", new Date().toISOString().split("T")[0]) // Filter for future events

  const { data: activeMinistriesData, error: activeMinistriesError } = await supabase
    .from("ministries")
    .select("id")
    .eq("is_active", true)

  if (membersCountError) console.error("Error fetching members count:", membersCountError)
  if (totalDonationsError) console.error("Error fetching total donations:", totalDonationsError)
  if (upcomingEventsError) console.error("Error fetching upcoming events:", upcomingEventsError)
  if (activeMinistriesError) console.error("Error fetching active ministries:", activeMinistriesError)

  const totalDonations = totalDonationsData?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membersCountData?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Registered members in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDonations.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total amount received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEventsData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Events scheduled in the future</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ministries</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMinistriesData?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active church ministries</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Users, Calendar, UserCheck, DollarSign, Church, BookOpen } from "lucide-react"
import { format } from "date-fns"
import type { Tables } from "@/integrations/supabase/types"

interface MemberWithDetails extends Tables<"members"> {}

interface EventWithDetails extends Tables<"events"> {
  ministries?: { name: string } | null
}

interface DonationWithMember extends Tables<"donations"> {
  members?: { first_name: string; last_name: string } | null
}

interface EventRegistrationWithDetails extends Tables<"event_registrations"> {
  events?: { title: string } | null
  members?: { first_name: string; last_name: string } | null
}

interface MinistryWithLeader extends Tables<"ministries"> {
  leader?: { first_name: string; last_name: string } | null
}

interface SermonWithDetails extends Tables<"sermons"> {}

export default function Records() {
  const [members, setMembers] = useState<MemberWithDetails[]>([])
  const [events, setEvents] = useState<EventWithDetails[]>([])
  const [donations, setDonations] = useState<DonationWithMember[]>([])
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistrationWithDetails[]>([])
  const [ministries, setMinistries] = useState<MinistryWithLeader[]>([])
  const [sermons, setSermons] = useState<SermonWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false })

      if (membersError) throw membersError

      // Fetch events with ministry info
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select(`
          *,
          ministries(name)
        `)
        .order("created_at", { ascending: false })

      if (eventsError) throw eventsError

      // Fetch donations with member info
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select(`
          *,
          members(first_name, last_name)
        `)
        .order("created_at", { ascending: false })

      if (donationsError) throw donationsError

      // Fetch event registrations with event and member info
      const { data: registrationsData, error: registrationsError } = await supabase
        .from("event_registrations")
        .select(`
          *,
          events(title),
          members(first_name, last_name)
        `)
        .order("registration_date", { ascending: false })

      if (registrationsError) throw registrationsError

      // Fetch ministries with leader info
      const { data: ministriesData, error: ministriesError } = await supabase
        .from("ministries")
        .select(`
          *,
          leader:members!ministries_leader_id_fkey(first_name, last_name)
        `)
        .order("created_at", { ascending: false })

      if (ministriesError) throw ministriesError

      // Fetch sermons
      const { data: sermonsData, error: sermonsError } = await supabase
        .from("sermons")
        .select("*")
        .order("created_at", { ascending: false })

      if (sermonsError) throw sermonsError

      setMembers(membersData || [])
      setEvents(eventsData || [])
      setDonations(donationsData || [])
      setEventRegistrations(registrationsData || [])
      setMinistries(ministriesData || [])
      setSermons(sermonsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch records data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Record deleted successfully",
      })

      fetchAllData() // Refresh data
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Records Management</h1>
        <p className="text-muted-foreground">Admin Dashboard - Manage all church records</p>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="registrations" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Registrations ({eventRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Donations ({donations.length})
          </TabsTrigger>
          <TabsTrigger value="ministries" className="flex items-center gap-2">
            <Church className="h-4 w-4" />
            Ministries ({ministries.length})
          </TabsTrigger>
          <TabsTrigger value="sermons" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Sermons ({sermons.length})
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Member Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell>{member.email || "N/A"}</TableCell>
                      <TableCell>{member.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.membership_status || "Unknown"}</Badge>
                      </TableCell>
                      <TableCell>
                        {member.join_date ? format(new Date(member.join_date), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("members", member.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Ministry</TableHead>
                    <TableHead>Registration Required</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{format(new Date(event.event_date), "MMM dd, yyyy HH:mm")}</TableCell>
                      <TableCell>{event.location || "N/A"}</TableCell>
                      <TableCell>{event.ministries?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={event.registration_required ? "default" : "secondary"}>
                          {event.registration_required ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("events", event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Registrations Tab */}
        <TabsContent value="registrations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Registration Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Registration
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Attended</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        {registration.members?.first_name} {registration.members?.last_name}
                      </TableCell>
                      <TableCell>{registration.events?.title}</TableCell>
                      <TableCell>{format(new Date(registration.registration_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={registration.attended ? "default" : "secondary"}>
                          {registration.attended ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{registration.payment_status || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete("event_registrations", registration.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Donation Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Donation
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Fund</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        {donation.members?.first_name} {donation.members?.last_name}
                      </TableCell>
                      <TableCell className="font-medium">${Number(donation.amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{donation.donation_type || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>{donation.fund_designation || "General"}</TableCell>
                      <TableCell>{format(new Date(donation.donation_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("donations", donation.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ministries Tab */}
        <TabsContent value="ministries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ministry Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Ministry
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Meeting Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ministries.map((ministry) => (
                    <TableRow key={ministry.id}>
                      <TableCell className="font-medium">{ministry.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ministry.category || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        {ministry.leader?.first_name} {ministry.leader?.last_name}
                      </TableCell>
                      <TableCell>{ministry.meeting_day || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={ministry.is_active ? "default" : "secondary"}>
                          {ministry.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("ministries", ministry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sermons Tab */}
        <TabsContent value="sermons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sermon Records</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Sermon
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Speaker</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Series</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sermons.map((sermon) => (
                    <TableRow key={sermon.id}>
                      <TableCell className="font-medium">{sermon.title}</TableCell>
                      <TableCell>{sermon.speaker || "N/A"}</TableCell>
                      <TableCell>
                        {sermon.sermon_date ? format(new Date(sermon.sermon_date), "MMM dd, yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{sermon.series_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={sermon.is_published ? "default" : "secondary"}>
                          {sermon.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete("sermons", sermon.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Server-side Supabase client for data fetching
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function getMembers() {
  const { data, error } = await supabaseAdmin.from("members").select("*").order("first_name")
  if (error) {
    console.error("Error fetching members:", error)
    return []
  }
  return data
}

async function getDonations() {
  const { data, error } = await supabaseAdmin
    .from("donations")
    .select("*, members(first_name, last_name)")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching donations:", error)
    return []
  }
  return data
}

async function getEvents() {
  const { data, error } = await supabaseAdmin.from("events").select("*").order("date", { ascending: false })
  if (error) {
    console.error("Error fetching events:", error)
    return []
  }
  return data
}

async function getAttendance() {
  const { data, error } = await supabaseAdmin
    .from("attendance")
    .select("*, members(first_name, last_name), events(name, date)")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching attendance:", error)
    return []
  }
  return data
}

async function getVolunteers() {
  const { data, error } = await supabaseAdmin
    .from("volunteers")
    .select("*, members(first_name, last_name), events(name, date)")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching volunteers:", error)
    return []
  }
  return data
}

async function getMinistries() {
  const { data, error } = await supabaseAdmin.from("ministries").select("*").order("name")
  if (error) {
    console.error("Error fetching ministries:", error)
    return []
  }
  return data
}

export default async function RecordsPage() {
  const members = await getMembers()
  const donations = await getDonations()
  const events = await getEvents()
  const attendance = await getAttendance()
  const volunteers = await getVolunteers()
  const ministries = await getMinistries()

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="donations">Donations</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="attendance">Attendance</TabsTrigger>
        <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
        <TabsTrigger value="ministries">Ministries</TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <Card>
          <CardHeader>
            <CardTitle>All Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.first_name}</TableCell>
                    <TableCell>{member.last_name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="donations">
        <Card>
          <CardHeader>
            <CardTitle>All Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>${donation.amount?.toFixed(2)}</TableCell>
                    <TableCell>{donation.type}</TableCell>
                    <TableCell>
                      {donation.members?.first_name} {donation.members?.last_name}
                    </TableCell>
                    <TableCell>{donation.notes}</TableCell>
                    <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="events">
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attendance">
        <Card>
          <CardHeader>
            <CardTitle>All Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Recorded At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.members?.first_name} {record.members?.last_name}
                    </TableCell>
                    <TableCell>{record.events?.name}</TableCell>
                    <TableCell>{record.events?.date}</TableCell>
                    <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="volunteers">
        <Card>
          <CardHeader>
            <CardTitle>All Volunteer Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell>
                      {volunteer.members?.first_name} {volunteer.members?.last_name}
                    </TableCell>
                    <TableCell>{volunteer.events?.name}</TableCell>
                    <TableCell>{volunteer.role}</TableCell>
                    <TableCell>{new Date(volunteer.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ministries">
        <Card>
          <CardHeader>
            <CardTitle>All Ministries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ministries.map((ministry) => (
                  <TableRow key={ministry.id}>
                    <TableCell>{ministry.name}</TableCell>
                    <TableCell>{ministry.description}</TableCell>
                    <TableCell>{new Date(ministry.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

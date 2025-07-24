"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState("members")
  const [records, setRecords] = useState<any>({
    members: [],
    events: [],
    registrations: [],
    donations: [],
    ministries: [],
    sermons: [],
  })
  const [loading, setLoading] = useState(true)

  const fetchRecords = async (tab: string) => {
    setLoading(true)
    let data, error

    switch (tab) {
      case "members":
        ;({ data, error } = await supabase.from("members").select("*").order("last_name", { ascending: true }))
        break
      case "events":
        ;({ data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false }))
        break
      case "registrations":
        ;({ data, error } = await supabase
          .from("event_registrations")
          .select("*, members(first_name, last_name), events(name)")
          .order("registration_date", { ascending: false }))
        break
      case "donations":
        ;({ data, error } = await supabase
          .from("donations")
          .select("*, members(first_name, last_name)")
          .order("donation_date", { ascending: false }))
        break
      case "ministries":
        ;({ data, error } = await supabase.from("ministries").select("*").order("name", { ascending: true }))
        break
      case "sermons":
        ;({ data, error } = await supabase.from("sermons").select("*").order("sermon_date", { ascending: false }))
        break
      default:
        data = []
        error = null
    }

    if (error) {
      toast.error(`Error fetching ${tab} records: ${error.message}`)
    } else {
      setRecords((prev: any) => ({ ...prev, [tab]: data }))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRecords(activeTab)
  }, [activeTab])

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) {
      toast.error(`Error deleting record: ${error.message}`)
    } else {
      toast.success("Record deleted successfully!")
      fetchRecords(activeTab) // Re-fetch records after deletion
    }
  }

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={10} className="text-center py-8">
            Loading records...
          </TableCell>
        </TableRow>
      )
    }

    if (records[activeTab]?.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10} className="text-center py-8">
            No records found for {activeTab}.
          </TableCell>
        </TableRow>
      )
    }

    switch (activeTab) {
      case "members":
        return records.members.map((record: any) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.first_name} {record.last_name}
            </TableCell>
            <TableCell>{record.email}</TableCell>
            <TableCell>{record.phone_number}</TableCell>
            <TableCell>{record.address}</TableCell>
            <TableCell>{record.date_of_birth}</TableCell>
            <TableCell>{record.gender}</TableCell>
            <TableCell>{record.membership_date}</TableCell>
            <TableCell>
              <Badge variant={record.is_active ? "default" : "secondary"}>
                {record.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{record.role}</TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("members", record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "events":
        return records.events.map((record: any) => (
          <TableRow key={record.id}>
            <TableCell>{record.name}</TableCell>
            <TableCell>{record.event_date}</TableCell>
            <TableCell>{record.start_time}</TableCell>
            <TableCell>{record.end_time}</TableCell>
            <TableCell>{record.location}</TableCell>
            <TableCell>{record.description}</TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("events", record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "registrations":
        return records.registrations.map((record: any) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.members?.first_name} {record.members?.last_name}
            </TableCell>
            <TableCell>{record.events?.name}</TableCell>
            <TableCell>{record.registration_date}</TableCell>
            <TableCell>{record.status}</TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("event_registrations", record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "donations":
        return records.donations.map((record: any) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.members?.first_name} {record.members?.last_name}
            </TableCell>
            <TableCell>${record.amount?.toFixed(2)}</TableCell>
            <TableCell>{record.donation_date}</TableCell>
            <TableCell>{record.type}</TableCell>
            <TableCell>{record.notes}</TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("donations", record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "ministries":
        return records.ministries.map((record: any) => (
          <TableRow key={record.id}>
            <TableCell>{record.name}</TableCell>
            <TableCell>{record.description}</TableCell>
            <TableCell>
              <Badge variant={record.is_active ? "default" : "secondary"}>
                {record.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("ministries", record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "sermons":
        return records.sermons.map((record: any) => (
          <TableRow key={record.id}>
            <TableCell>{record.title}</TableCell>
            <TableCell>{record.speaker}</TableCell>
            <TableCell>{record.sermon_date}</TableCell>
            <TableCell>{record.topic}</TableCell>
            <TableCell>{record.audio_url}</TableCell>
            <TableCell>{record.video_url}</TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" onClick={() => handleDelete("sermons", record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      default:
        return null
    }
  }

  const renderTableHeaders = () => {
    switch (activeTab) {
      case "members":
        return (
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Membership Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "events":
        return (
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "registrations":
        return (
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "donations":
        return (
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "ministries":
        return (
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "sermons":
        return (
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Speaker</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Topic</TableHead>
            <TableHead>Audio URL</TableHead>
            <TableHead>Video URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Records Management</h1>
      <Tabs defaultValue="members" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="ministries">Ministries</TabsTrigger>
          <TabsTrigger value="sermons">Sermons</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

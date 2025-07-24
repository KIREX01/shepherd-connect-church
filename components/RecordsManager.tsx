"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"

type RecordType = keyof Database["public"]["Tables"]

interface RecordsManagerProps {
  recordType: RecordType
}

export default function RecordsManager({ recordType }: RecordsManagerProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    let query = supabase.from(recordType).select("*")

    // Add relationships for display
    if (recordType === "donations") {
      query = supabase.from("donations").select("*, members(first_name, last_name)")
    } else if (recordType === "registrations") {
      query = supabase.from("registrations").select("*, members(first_name, last_name), events(name, date)")
    } else if (recordType === "attendance") {
      query = supabase.from("attendance").select("*, members(first_name, last_name), events(name, date)")
    } else if (recordType === "volunteers") {
      query = supabase.from("volunteers").select("*, members(first_name, last_name), events(name, date)")
    }

    const { data, error } = await query

    if (error) {
      toast({
        title: `Error fetching ${recordType}`,
        description: error.message,
        variant: "destructive",
      })
      setRecords([])
    } else {
      setRecords(data || [])
    }
    setLoading(false)
  }, [recordType, supabase, toast])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${recordType} record?`)) {
      return
    }
    setLoading(true)
    const { error } = await supabase.from(recordType).delete().eq("id", id)

    if (error) {
      toast({
        title: `Error deleting ${recordType} record`,
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Record deleted successfully!",
        description: `The ${recordType} record has been removed.`,
      })
      fetchRecords() // Re-fetch records after deletion
    }
    setLoading(false)
  }

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center">
            Loading...
          </TableCell>
        </TableRow>
      )
    }
    if (records.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center">
            No records found.
          </TableCell>
        </TableRow>
      )
    }

    switch (recordType) {
      case "members":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.first_name} {record.last_name}
            </TableCell>
            <TableCell>{record.email}</TableCell>
            <TableCell>{record.phone || "N/A"}</TableCell>
            <TableCell>{record.role}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "events":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.name}</TableCell>
            <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
            <TableCell>{record.time}</TableCell>
            <TableCell>{record.location}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "donations":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>${record.amount.toFixed(2)}</TableCell>
            <TableCell>{record.type}</TableCell>
            <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
            <TableCell>{record.members ? `${record.members.first_name} ${record.members.last_name}` : "N/A"}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "ministries":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.name}</TableCell>
            <TableCell>{record.description || "N/A"}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "registrations":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.members.first_name} {record.members.last_name}
            </TableCell>
            <TableCell>
              {record.events.name} ({format(new Date(record.events.date), "MMM dd, yyyy")})
            </TableCell>
            <TableCell>{format(new Date(record.registration_date), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "sermons":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.title}</TableCell>
            <TableCell>{record.speaker}</TableCell>
            <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              {record.url ? (
                <a
                  href={record.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Link
                </a>
              ) : (
                "N/A"
              )}
            </TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "attendance":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.members.first_name} {record.members.last_name}
            </TableCell>
            <TableCell>
              {record.events.name} ({format(new Date(record.events.date), "MMM dd, yyyy")})
            </TableCell>
            <TableCell>{format(new Date(record.timestamp), "MMM dd, yyyy")}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      case "volunteers":
        return records.map((record) => (
          <TableRow key={record.id}>
            <TableCell>
              {record.members.first_name} {record.members.last_name}
            </TableCell>
            <TableCell>
              {record.events.name} ({format(new Date(record.events.date), "MMM dd, yyyy")})
            </TableCell>
            <TableCell>{record.role}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>
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
    switch (recordType) {
      case "members":
        return (
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "events":
        return (
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "donations":
        return (
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "ministries":
        return (
          <TableRow>
            <TableHead>Name</TableHead>
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
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "sermons":
        return (
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Speaker</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "attendance":
        return (
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      case "volunteers":
        return (
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        )
      default:
        return null
    }
  }

  return (
    <main className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Records Management</h1>
        <p className="text-muted-foreground">Admin Dashboard - Manage all church records</p>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="members" className="flex items-center gap-2">
            Members
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            Events
          </TabsTrigger>
          <TabsTrigger value="registrations" className="flex items-center gap-2">
            Registrations
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            Donations
          </TabsTrigger>
          <TabsTrigger value="ministries" className="flex items-center gap-2">
            Ministries
          </TabsTrigger>
          <TabsTrigger value="sermons" className="flex items-center gap-2">
            Sermons
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Member Records</CardTitle>
              <Button>Add Member</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Records</CardTitle>
              <Button>Add Event</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Registrations Tab */}
        <TabsContent value="registrations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Event Registration Records</CardTitle>
              <Button>Add Registration</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donations Tab */}
        <TabsContent value="donations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Donation Records</CardTitle>
              <Button>Add Donation</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ministries Tab */}
        <TabsContent value="ministries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Ministry Records</CardTitle>
              <Button>Add Ministry</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sermons Tab */}
        <TabsContent value="sermons">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sermon Records</CardTitle>
              <Button>Add Sermon</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance Records</CardTitle>
              <Button>Add Attendance</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>{renderTableHeaders()}</TableHeader>
                <TableBody>{renderTableContent()}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Volunteer Records</CardTitle>
              <Button>Add Volunteer</Button>
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
    </main>
  )
}

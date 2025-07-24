"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RecordsManager from "@/components/RecordsManager"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState("members")

  const handleDelete = async (table: string, id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) {
      toast.error(`Error deleting record: ${error.message}`)
    } else {
      toast.success("Record deleted successfully!")
      // Re-fetch records after deletion
    }
  }

  return (
    <Card className="container mx-auto py-8">
      <CardHeader>
        <CardTitle>Church Records</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="ministries">Ministries</TabsTrigger>
            <TabsTrigger value="sermons">Sermons</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-4">
            <RecordsManager recordType="members" onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <RecordsManager recordType="events" onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="registrations" className="mt-4">
            <RecordsManager recordType="registrations" onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="donations" className="mt-4">
            <RecordsManager recordType="donations" onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="ministries" className="mt-4">
            <RecordsManager recordType="ministries" onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="sermons" className="mt-4">
            <RecordsManager recordType="sermons" onDelete={handleDelete} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

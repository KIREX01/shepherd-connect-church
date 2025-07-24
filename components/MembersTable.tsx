"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Users, Calendar, MapPin, Phone } from "lucide-react"
import { format } from "date-fns"
import type { Tables } from "@/types/supabase"

export function MembersTable() {
  const {
    data: members,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false })

      if (error) throw error
      return data as Tables<"members">[]
    },
  })

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
          <p className="text-muted-foreground">Failed to load member records. Please try again.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Member Directory</h1>
            <p className="text-muted-foreground">View and manage registered church members</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Members</p>
                  <p className="text-2xl font-bold">{members?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">New This Month</p>
                  <p className="text-2xl font-bold">
                    {members?.filter((member) => {
                      const memberDate = new Date(member.created_at)
                      const now = new Date()
                      return memberDate.getMonth() === now.getMonth() && memberDate.getFullYear() === now.getFullYear()
                    }).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Badge className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Active Members</p>
                  <p className="text-2xl font-bold">
                    {members?.filter((m) => m.membership_status === "active").length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Members</CardTitle>
          <CardDescription>Complete list of all registered church members</CardDescription>
        </CardHeader>
        <CardContent>
          {!members || members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No members found</p>
              <p className="text-sm">Members will appear here once they register</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="font-medium">
                          {member.first_name} {member.last_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {member.email && <div className="text-sm">{member.email}</div>}
                          {member.phone && (
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-3 w-3" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.address ? (
                          <div className="flex items-center space-x-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {member.address}
                              {member.city && `, ${member.city}`}
                              {member.state && `, ${member.state}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No address</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {member.membership_status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.join_date ? (
                          format(new Date(member.join_date), "MMM dd, yyyy")
                        ) : (
                          <span className="text-muted-foreground text-sm">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(member.created_at), "MMM dd, yyyy")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

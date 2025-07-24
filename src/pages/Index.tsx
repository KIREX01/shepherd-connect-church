"use client"

import { StatsCards } from "@/components/Dashboard/StatsCards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Link } from "react-router-dom"
import { Users, DollarSign, Calendar, FileText, Church, Heart } from "lucide-react"

export default function Index() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Church Management Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening in your church.</p>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Management
            </CardTitle>
            <CardDescription>Register new members and manage existing member information</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forms">
              <Button className="w-full">Manage Members</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Donation Tracking
            </CardTitle>
            <CardDescription>Record and track church donations and contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forms">
              <Button className="w-full">Record Donations</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Planning
            </CardTitle>
            <CardDescription>Create and manage church events and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forms">
              <Button className="w-full">Create Events</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Church className="h-5 w-5" />
              Ministry Management
            </CardTitle>
            <CardDescription>Organize and manage church ministries and programs</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forms">
              <Button className="w-full">Manage Ministries</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Volunteer Coordination
            </CardTitle>
            <CardDescription>Manage volunteer registrations and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forms">
              <Button className="w-full">Manage Volunteers</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Records & Reports
            </CardTitle>
            <CardDescription>View and manage all church records and generate reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/records">
              <Button className="w-full">View Records</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

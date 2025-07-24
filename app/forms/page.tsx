"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MemberRegistrationForm from "@/components/forms/MemberRegistrationForm"
import DonationEntryForm from "@/components/forms/DonationEntryForm"
import EventCreationForm from "@/components/forms/EventCreationForm"
import AttendanceEntryForm from "@/components/forms/AttendanceEntryForm"
import VolunteerRegistrationForm from "@/components/forms/VolunteerRegistrationForm"
import MinistryCreationForm from "@/components/forms/MinistryCreationForm"

export default function FormsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Forms</h1>
      <Tabs defaultValue="member-registration">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="member-registration">Member Registration</TabsTrigger>
          <TabsTrigger value="donation-entry">Donation Entry</TabsTrigger>
          <TabsTrigger value="event-creation">Event Creation</TabsTrigger>
          <TabsTrigger value="attendance-entry">Attendance Entry</TabsTrigger>
          <TabsTrigger value="volunteer-registration">Volunteer Registration</TabsTrigger>
          <TabsTrigger value="ministry-creation">Ministry Creation</TabsTrigger>
        </TabsList>

        <TabsContent value="member-registration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Register New Member</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberRegistrationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donation-entry" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <DonationEntryForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="event-creation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <EventCreationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance-entry" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Record Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceEntryForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteer-registration" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Register Volunteer</CardTitle>
            </CardHeader>
            <CardContent>
              <VolunteerRegistrationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ministry-creation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Ministry</CardTitle>
            </CardHeader>
            <CardContent>
              <MinistryCreationForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

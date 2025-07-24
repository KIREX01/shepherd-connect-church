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
    <Tabs defaultValue="member-registration" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="member-registration">Member</TabsTrigger>
        <TabsTrigger value="donation-entry">Donation</TabsTrigger>
        <TabsTrigger value="event-creation">Event</TabsTrigger>
        <TabsTrigger value="attendance-entry">Attendance</TabsTrigger>
        <TabsTrigger value="volunteer-registration">Volunteer</TabsTrigger>
        <TabsTrigger value="ministry-creation">Ministry</TabsTrigger>
      </TabsList>

      <TabsContent value="member-registration">
        <Card>
          <CardHeader>
            <CardTitle>Member Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberRegistrationForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="donation-entry">
        <Card>
          <CardHeader>
            <CardTitle>Donation Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <DonationEntryForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="event-creation">
        <Card>
          <CardHeader>
            <CardTitle>Event Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <EventCreationForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="attendance-entry">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceEntryForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="volunteer-registration">
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <VolunteerRegistrationForm />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ministry-creation">
        <Card>
          <CardHeader>
            <CardTitle>Ministry Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <MinistryCreationForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

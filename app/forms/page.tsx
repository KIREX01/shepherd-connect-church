import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MemberRegistrationForm from "@/components/forms/MemberRegistrationForm"
import DonationEntryForm from "@/components/forms/DonationEntryForm"
import EventCreationForm from "@/components/forms/EventCreationForm"
import AttendanceEntryForm from "@/components/forms/AttendanceEntryForm"
import VolunteerRegistrationForm from "@/components/forms/VolunteerRegistrationForm"
import MinistryCreationForm from "@/components/forms/MinistryCreationForm"

export default function FormsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Church Forms</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="member-registration">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="member-registration">Member</TabsTrigger>
            <TabsTrigger value="donation-entry">Donation</TabsTrigger>
            <TabsTrigger value="event-creation">Event</TabsTrigger>
            <TabsTrigger value="attendance-entry">Attendance</TabsTrigger>
            <TabsTrigger value="volunteer-registration">Volunteer</TabsTrigger>
            <TabsTrigger value="ministry-creation">Ministry</TabsTrigger>
          </TabsList>
          <TabsContent value="member-registration" className="mt-4">
            <MemberRegistrationForm />
          </TabsContent>
          <TabsContent value="donation-entry" className="mt-4">
            <DonationEntryForm />
          </TabsContent>
          <TabsContent value="event-creation" className="mt-4">
            <EventCreationForm />
          </TabsContent>
          <TabsContent value="attendance-entry" className="mt-4">
            <AttendanceEntryForm />
          </TabsContent>
          <TabsContent value="volunteer-registration" className="mt-4">
            <VolunteerRegistrationForm />
          </TabsContent>
          <TabsContent value="ministry-creation" className="mt-4">
            <MinistryCreationForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

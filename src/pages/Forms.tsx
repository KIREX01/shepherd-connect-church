import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MemberRegistrationForm } from "@/components/forms/MemberRegistrationForm"
import { DonationEntryForm } from "@/components/forms/DonationEntryForm"
import { EventCreationForm } from "@/components/forms/EventCreationForm"
import { AttendanceEntryForm } from "@/components/forms/AttendanceEntryForm"
import { VolunteerRegistrationForm } from "@/components/forms/VolunteerRegistrationForm"
import { MinistryCreationForm } from "@/components/forms/MinistryCreationForm"
import { Users, DollarSign, Calendar, UserCheck, Heart, Church } from "lucide-react"

export default function Forms() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Church Forms</h1>
        <p className="text-muted-foreground">Manage church operations with these essential forms</p>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="ministries" className="flex items-center gap-2">
            <Church className="h-4 w-4" />
            Ministries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MemberRegistrationForm />
        </TabsContent>

        <TabsContent value="donations">
          <DonationEntryForm />
        </TabsContent>

        <TabsContent value="events">
          <EventCreationForm />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceEntryForm />
        </TabsContent>

        <TabsContent value="volunteers">
          <VolunteerRegistrationForm />
        </TabsContent>

        <TabsContent value="ministries">
          <MinistryCreationForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

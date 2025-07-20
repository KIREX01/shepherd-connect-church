import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberRegistrationForm } from "@/components/forms/MemberRegistrationForm";
import { AttendanceEntryForm } from "@/components/forms/AttendanceEntryForm";
import { DonationEntryForm } from "@/components/forms/DonationEntryForm";
import { EventCreationForm } from "@/components/forms/EventCreationForm";
import { VolunteerRegistrationForm } from "@/components/forms/VolunteerRegistrationForm";
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  Heart,
  ArrowLeft 
} from "lucide-react";

const Forms = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  const formOptions = [
    {
      id: "member",
      title: "Member Registration",
      description: "Register new members or visitors in the church directory",
      icon: Users,
      component: MemberRegistrationForm,
    },
    {
      id: "attendance",
      title: "Attendance Entry",
      description: "Record attendance for services and events",
      icon: UserCheck,
      component: AttendanceEntryForm,
    },
    {
      id: "donation",
      title: "Donation Entry",
      description: "Record donations and financial contributions",
      icon: DollarSign,
      component: DonationEntryForm,
    },
    {
      id: "event",
      title: "Event Creation",
      description: "Schedule new church events and activities",
      icon: Calendar,
      component: EventCreationForm,
    },
    {
      id: "volunteer",
      title: "Volunteer Registration",
      description: "Register volunteers for ministry opportunities",
      icon: Heart,
      component: VolunteerRegistrationForm,
    },
  ];

  if (selectedForm) {
    const form = formOptions.find(f => f.id === selectedForm);
    if (form) {
      const FormComponent = form.component;
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedForm(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forms
            </Button>
            <FormComponent />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Church Data Entry Forms</h1>
          <p className="text-xl text-muted-foreground">
            Select a form to begin entering church data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formOptions.map((form) => {
            const IconComponent = form.icon;
            return (
              <Card 
                key={form.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedForm(form.id)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{form.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center mb-4">
                    {form.description}
                  </p>
                  <Button className="w-full">
                    Open Form
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="member" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="member">Members</TabsTrigger>
                  <TabsTrigger value="attendance">Attendance</TabsTrigger>
                  <TabsTrigger value="donation">Donations</TabsTrigger>
                  <TabsTrigger value="event">Events</TabsTrigger>
                  <TabsTrigger value="volunteer">Volunteers</TabsTrigger>
                </TabsList>
                
                {formOptions.map((form) => {
                  const FormComponent = form.component;
                  return (
                    <TabsContent key={form.id} value={form.id} className="mt-6">
                      <FormComponent />
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Forms;
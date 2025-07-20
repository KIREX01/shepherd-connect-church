import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Users, Calendar, DollarSign, BarChart3, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Data Entry Forms",
      description: "Member registration, attendance tracking, donations, and events",
      icon: FileText,
      path: "/forms",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Member Management",
      description: "Manage church member directory and profiles",
      icon: Users,
      path: "/members",
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "Event Calendar",
      description: "Schedule and manage church events and activities",
      icon: Calendar,
      path: "/calendar",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: "Financial Management",
      description: "Track donations, expenses, and financial reports",
      icon: DollarSign,
      path: "/finance",
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
    },
    {
      title: "Reports & Analytics",
      description: "Generate insights and reports for church leadership",
      icon: BarChart3,
      path: "/reports",
      color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
    },
    {
      title: "Settings",
      description: "Configure church settings and user permissions",
      icon: Settings,
      path: "/settings",
      color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Church Management System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your church operations with our comprehensive management platform. 
            Track members, manage events, handle finances, and generate insightful reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <p className="text-muted-foreground text-sm mb-4">
                    {feature.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Open
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate("/forms")} 
                className="w-full"
              >
                Start with Data Entry Forms
              </Button>
              <p className="text-sm text-muted-foreground">
                Begin by entering church member information, recording attendance, or logging donations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

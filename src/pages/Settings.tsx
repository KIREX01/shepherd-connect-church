import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NotificationSettings } from '@/components/NotificationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your app preferences and notifications</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <NotificationSettings />

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>
                Shepherd Connect - Church Management System
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Version 1.0.0</p>
              <p>Stay connected with your church community through messages, events, prayer requests, and more.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
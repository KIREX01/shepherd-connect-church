
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrayerRequestForm } from '@/components/forms/PrayerRequestForm';
import { PrayerRequestsList } from '@/components/PrayerRequestsList';
import { Heart, Plus, List } from 'lucide-react';

export default function PrayerRequests() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Prayer Requests</h1>
              <p className="text-muted-foreground">Share prayer needs and pray for others</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="view" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              View Requests
            </TabsTrigger>
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Submit Request
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view">
            <PrayerRequestsList />
          </TabsContent>

          <TabsContent value="submit">
            <PrayerRequestForm />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}


import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrayerRequestForm } from '@/components/forms/PrayerRequestForm';
import { PrayerRequestsList } from '@/components/PrayerRequestsList';
import { Heart, Plus, List } from 'lucide-react';

export default function PrayerRequests() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-3 mb-4">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Prayer Requests</h1>
              <p className="text-sm md:text-base text-muted-foreground">Share prayer needs and pray for others</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="view" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger value="view" className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
              <List className="h-4 w-4" />
              <span>View Requests</span>
            </TabsTrigger>
            <TabsTrigger value="submit" className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
              <Plus className="h-4 w-4" />
              <span>Submit Request</span>
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

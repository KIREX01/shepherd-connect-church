import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const InstallPWA = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Install Shepherd Connect PWA</h1>
      <p className="text-center text-lg">Add Shepherd Connect to your home screen for a fast, app-like experience!</p>

      <Card>
        <CardHeader>
          <CardTitle>On Android (Chrome)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>1. Open Shepherd Connect in Chrome browser.</p>
          <p>2. Tap the menu icon (three vertical dots) in the top right corner.</p>
          <p>3. Select &quot;Add to Home screen&quot;.</p>
          <p>4. Follow the on-screen prompts to confirm.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>On iOS (Safari)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>1. Open Shepherd Connect in Safari browser.</p>
          <p>2. Tap the Share button (square with an arrow pointing upwards) in the bottom center.</p>
          <p>3. Scroll down and select &quot;Add to Home Screen&quot;.</p>
          <p>4. Tap &quot;Add&quot; in the top right corner.</p>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-center text-sm text-gray-500">
        Once installed, launch Shepherd Connect from your home screen for an optimized experience.
      </p>
    </div>
  );
};

export default InstallPWA;
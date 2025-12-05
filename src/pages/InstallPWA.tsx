import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 pb-20 md:pb-0">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">Install Shepherd Connect</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Add Shepherd Connect to your home screen for a fast, app-like experience!
        </p>
        
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          {isInstalled && (
            <Badge variant="default" className="gap-1">
              <Download className="h-3 w-3" />
              Installed
            </Badge>
          )}
        </div>

        <Button 
          onClick={handleInstallClick} 
          size="lg" 
          className="gap-2"
          disabled={isInstalled || !deferredPrompt}
        >
          <Download className="h-4 w-4" />
          {isInstalled ? 'Installed' : 'Install Now'}
        </Button>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>On Desktop (Chrome, Edge)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>1. Open Shepherd Connect in a supported browser (like Chrome or Edge).</p>
          <p>2. Look for an install icon in the address bar (usually a screen with a down arrow).</p>
          <p>3. Click the icon and then click &quot;Install&quot; in the confirmation pop-up.</p>
          <p>4. The app will be added to your desktop and can be launched like any other application.</p>
        </CardContent>
      </Card>

      <Separator />

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <WifiOff className="h-5 w-5" />
            Works Offline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Shepherd Connect works offline! Once installed:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>View previously loaded content without internet</li>
            <li>Access cached pages and data</li>
            <li>Automatic sync when back online</li>
          </ul>
        </CardContent>
      </Card>

      <p className="text-center text-xs md:text-sm text-muted-foreground">
        Once installed, launch Shepherd Connect from your home screen for an optimized experience with offline support.
      </p>
    </div>
  );
};

export default InstallPWA;
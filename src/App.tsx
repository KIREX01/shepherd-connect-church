
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Forms from "./pages/Forms";
import Members from "./pages/Members";
import Records from "./pages/Records";
import Dashboard from "./pages/Dashboard";
import PrayerRequests from "./pages/PrayerRequests";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Tasks from "./pages/Tasks";
import { ThemeProvider } from '@/components/ui/theme-provider';
import ChurchFinances from './pages/ChurchFinances';
import Tithes from './pages/Tithes';
import MemberAttendance from './pages/MemberAttendance';
import { QuickActions } from "@/components/QuickActions";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import InstallPWA from "./pages/InstallPWA";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/install" element={<InstallPWA />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/prayer-requests" 
                element={
                  <ProtectedRoute>
                    <PrayerRequests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/forms" 
                element={
                  <ProtectedRoute>
                    <Forms />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Members />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/records" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Records />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/finances" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ChurchFinances />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tithes" 
                element={
                  <ProtectedRoute>
                    <Tithes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/member-attendance" 
                element={
                  <ProtectedRoute>
                    <MemberAttendance />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quick-actions" 
                element={
                  <ProtectedRoute>
                    <QuickActions />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileBottomNav />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

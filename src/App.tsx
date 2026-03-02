
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
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
import Settings from "./pages/Settings";
import { ThemeProvider } from '@/components/ui/theme-provider';
import ChurchFinances from './pages/ChurchFinances';
import Tithes from './pages/Tithes';
import MemberAttendance from './pages/MemberAttendance';
import { QuickActions } from "@/components/QuickActions";
import InstallPWA from "./pages/InstallPWA";
import BibleVerses from "./pages/BibleVerses";

const queryClient = new QueryClient();

const ProtectedPage = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => (
  <ProtectedRoute requiredRole={requiredRole as any}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

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
              <Route path="/" element={<ProtectedPage><Index /></ProtectedPage>} />
              <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
              <Route path="/messages" element={<ProtectedPage><Messages /></ProtectedPage>} />
              <Route path="/tasks" element={<ProtectedPage><Tasks /></ProtectedPage>} />
              <Route path="/prayer-requests" element={<ProtectedPage><PrayerRequests /></ProtectedPage>} />
              <Route path="/bible-verses" element={<ProtectedPage><BibleVerses /></ProtectedPage>} />
              <Route path="/forms" element={<ProtectedPage><Forms /></ProtectedPage>} />
              <Route path="/members" element={<ProtectedPage requiredRole="admin"><Members /></ProtectedPage>} />
              <Route path="/records" element={<ProtectedPage requiredRole="admin"><Records /></ProtectedPage>} />
              <Route path="/finances" element={<ProtectedPage requiredRole="admin"><ChurchFinances /></ProtectedPage>} />
              <Route path="/tithes" element={<ProtectedPage><Tithes /></ProtectedPage>} />
              <Route path="/member-attendance" element={<ProtectedPage><MemberAttendance /></ProtectedPage>} />
              <Route path="/quick-actions" element={<ProtectedPage><QuickActions /></ProtectedPage>} />
              <Route path="/settings" element={<ProtectedPage><Settings /></ProtectedPage>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

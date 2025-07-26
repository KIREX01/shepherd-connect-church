import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Database, 
  Heart, 
  UserCheck, 
  Settings, 
  Shield,
  Church,
  Megaphone,
  BookOpen,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export function QuickActions() {
  const { userRole } = useAuth();

  const adminActions = [
    {
      title: 'Manage Members',
      description: 'Add, edit, and manage church members',
      icon: Users,
      href: '/members',
      color: 'bg-blue-500'
    },
    {
      title: 'Records Management',
      description: 'View and manage all church records',
      icon: Database,
      href: '/records',
      color: 'bg-green-500'
    },
    {
      title: 'Church Finances',
      description: 'Manage church financial records',
      icon: DollarSign,
      href: '/finances',
      color: 'bg-yellow-500'
    },
    {
      title: 'Member Attendance',
      description: 'Track member attendance and participation',
      icon: UserCheck,
      href: '/member-attendance',
      color: 'bg-purple-500'
    },
    {
      title: 'Tithes & Offerings',
      description: 'Manage tithes and offerings',
      icon: DollarSign,
      href: '/tithes',
      color: 'bg-emerald-500'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings and permissions',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500'
    },
    {
      title: 'Announcements',
      description: 'Create and manage announcements',
      icon: Megaphone,
      href: '/dashboard#announcements',
      color: 'bg-orange-500'
    },
    {
      title: 'Events',
      description: 'Manage church events and activities',
      icon: Calendar,
      href: '/dashboard#events',
      color: 'bg-indigo-500'
    },
    {
      title: 'Prayer Requests',
      description: 'View and manage prayer requests',
      icon: Heart,
      href: '/prayer-requests',
      color: 'bg-red-500'
    }
  ];

  const pastorActions = [
    {
      title: 'View Members',
      description: 'View church member information',
      icon: Users,
      href: '/members',
      color: 'bg-blue-500'
    },
    {
      title: 'My Tithes',
      description: 'Track your personal tithes and offerings',
      icon: DollarSign,
      href: '/tithes',
      color: 'bg-emerald-500'
    },
    {
      title: 'Member Attendance',
      description: 'Track member attendance and participation',
      icon: UserCheck,
      href: '/member-attendance',
      color: 'bg-purple-500'
    },
    {
      title: 'Prayer Requests',
      description: 'View and manage prayer requests',
      icon: Heart,
      href: '/prayer-requests',
      color: 'bg-red-500'
    }
  ];

  const memberActions = [
    {
      title: 'My Tithes',
      description: 'Track your tithes and offerings',
      icon: DollarSign,
      href: '/tithes',
      color: 'bg-emerald-500'
    },
    {
      title: 'My Attendance',
      description: 'Track your attendance at church activities',
      icon: UserCheck,
      href: '/member-attendance',
      color: 'bg-purple-500'
    },
    {
      title: 'Prayer Requests',
      description: 'Submit and view prayer requests',
      icon: Heart,
      href: '/prayer-requests',
      color: 'bg-red-500'
    },
    {
      title: 'Forms',
      description: 'Access church forms and registrations',
      icon: FileText,
      href: '/forms',
      color: 'bg-blue-500'
    },
    {
      title: 'Announcements',
      description: 'View church announcements',
      icon: Megaphone,
      href: '/dashboard#announcements',
      color: 'bg-orange-500'
    },
    {
      title: 'Events',
      description: 'View and register for events',
      icon: Calendar,
      href: '/dashboard#events',
      color: 'bg-indigo-500'
    }
  ];

  const getActions = () => {
    switch (userRole) {
      case 'admin':
        return adminActions;
      case 'pastor':
        return pastorActions;
      default:
        return memberActions;
    }
  };

  const actions = getActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Button 
                variant="outline" 
                className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
import { useAuth } from '@/hooks/useAuth';
import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  MessageCircle,
  Heart,
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  UserCheck,
  Users,
  Database,
  DollarSign,
  Settings,
  LogOut,
  Church,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const communityItems = [
  { href: '/messages', label: 'Messages', icon: MessageCircle },
  { href: '/prayer-requests', label: 'Prayer Requests', icon: Heart },
  { href: '/bible-verses', label: 'Bible Verses', icon: BookOpen },
  { href: '/dashboard', label: 'Events & News', icon: Calendar },
];

const managementItems = [
  { href: '/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/forms', label: 'Forms', icon: FileText },
  { href: '/member-attendance', label: 'Attendance', icon: UserCheck },
];

const adminItems = [
  { href: '/members', label: 'Members', icon: Users },
  { href: '/records', label: 'Records', icon: Database },
  { href: '/tithes', label: 'Tithes', icon: DollarSign },
  { href: '/finances', label: 'Church Finances', icon: DollarSign },
];

export function AppSidebar() {
  const { userRole, signOut } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  const renderNavItem = (item: { href: string; label: string; icon: any }) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        asChild
        isActive={isActive(item.href)}
        tooltip={item.label}
      >
        <Link to={item.href} className="flex items-center gap-3">
          <item.icon className="h-4 w-4 shrink-0" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Church className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                BUCU Fellowship
              </span>
              <span className="text-[11px] text-[hsl(var(--sidebar-muted-foreground))]">
                Church Management
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive('/')}
                  tooltip="Home"
                >
                  <Link to="/" className="flex items-center gap-3">
                    <Home className="h-4 w-4 shrink-0" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Community */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-muted-foreground))] text-[11px] uppercase tracking-wider font-semibold">
            Community
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-muted-foreground))] text-[11px] uppercase tracking-wider font-semibold">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin */}
        {(userRole === 'admin' || userRole === 'pastor') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[hsl(var(--sidebar-muted-foreground))] text-[11px] uppercase tracking-wider font-semibold">
              Admin
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map(renderNavItem)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Tithes for members */}
        {userRole === 'member' && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {renderNavItem({ href: '/tithes', label: 'My Tithes', icon: DollarSign })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          {renderNavItem({ href: '/settings', label: 'Settings', icon: Settings })}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={() => signOut()}
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

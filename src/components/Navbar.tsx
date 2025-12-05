import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Church, Users, DollarSign, FileText, LogOut, Home, Database, MessageCircle, ChevronDown, UserCheck, Menu, ClipboardList, Settings, Heart, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/ui/theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const { user, signOut, userRole } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;
  const isActiveGroup = (paths: string[]) => paths.some(path => location.pathname === path);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Grouped navigation items for dropdowns
  const managementItems = [
    { href: '/tasks', label: 'Tasks', icon: ClipboardList },
    { href: '/forms', label: 'Forms', icon: FileText },
    { href: '/member-attendance', label: 'Attendance', icon: UserCheck },
  ];

  const communityItems = [
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/prayer-requests', label: 'Prayer Requests', icon: Heart },
    { href: '/dashboard', label: 'Events & Announcements', icon: Calendar },
  ];

  const adminItems = [
    { href: '/members', label: 'Members', icon: Users },
    { href: '/records', label: 'Records', icon: Database },
    { href: '/tithes', label: 'Tithes', icon: DollarSign },
    { href: '/finances', label: 'Church Finances', icon: Database },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Church className="h-8 w-8 text-primary" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold">Church Management</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold">Church Management</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Dashboard - Always visible */}
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>

            {/* Community Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={isActiveGroup(['/messages', '/prayer-requests', '/dashboard']) ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Community</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border z-50">
                {communityItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="flex items-center space-x-2 w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Management Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={isActiveGroup(['/tasks', '/forms', '/member-attendance']) ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Management</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border z-50">
                {managementItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="flex items-center space-x-2 w-full">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin Dropdown - Only for admin/pastor */}
            {(userRole === 'admin' || userRole === 'pastor') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={isActiveGroup(['/members', '/records', '/tithes', '/finances']) ? 'default' : 'ghost'} 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Database className="h-4 w-4" />
                    <span>Admin</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-popover border z-50">
                  {adminItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center space-x-2 w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Tithes for non-admin users */}
            {userRole === 'member' && (
              <Link to="/tithes">
                <Button 
                  variant={isActive('/tithes') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Tithes</span>
                </Button>
              </Link>
            )}

            {/* Settings */}
            <Link to="/settings">
              <Button 
                variant={isActive('/settings') ? 'default' : 'ghost'} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l">
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full capitalize">
                {userRole}
              </span>
              
              {/* Theme Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border z-50">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center">
                    <Monitor className="h-4 w-4 mr-2" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" onClick={handleSignOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-3">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
              {userRole}
            </span>

            {/* Theme Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border z-50">
                <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center">
                  <Sun className="h-4 w-4 mr-2" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center">
                  <Moon className="h-4 w-4 mr-2" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center">
                  <Monitor className="h-4 w-4 mr-2" /> System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Church className="h-6 w-6 text-primary" />
                    <span>Navigation</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* User Info */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Welcome, {user?.user_metadata?.first_name || user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">Role: {userRole}</p>
                  </div>

                  {/* Main Navigation */}
                  <div className="space-y-2">
                    <Link to="/" onClick={closeMobileMenu}>
                      <Button 
                        variant={isActive('/') ? 'default' : 'ghost'} 
                        className="w-full justify-start"
                      >
                        <Home className="h-4 w-4 mr-3" />
                        Dashboard
                      </Button>
                    </Link>
                  </div>

                  {/* Community Section */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">Community</h3>
                    {communityItems.map((item) => (
                      <Link key={item.href} to={item.href} onClick={closeMobileMenu}>
                        <Button 
                          variant={isActive(item.href) ? 'default' : 'ghost'} 
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {/* Management Section */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">Management</h3>
                    {managementItems.map((item) => (
                      <Link key={item.href} to={item.href} onClick={closeMobileMenu}>
                        <Button 
                          variant={isActive(item.href) ? 'default' : 'ghost'} 
                          className="w-full justify-start"
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {/* Admin Section */}
                  {(userRole === 'admin' || userRole === 'pastor') && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-2">Admin</h3>
                      {adminItems.map((item) => (
                        <Link key={item.href} to={item.href} onClick={closeMobileMenu}>
                          <Button 
                            variant={isActive(item.href) ? 'default' : 'ghost'} 
                            className="w-full justify-start"
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tithes for non-admin */}
                  {userRole === 'member' && (
                    <div className="space-y-2">
                      <Link to="/tithes" onClick={closeMobileMenu}>
                        <Button 
                          variant={isActive('/tithes') ? 'default' : 'ghost'} 
                          className="w-full justify-start"
                        >
                          <DollarSign className="h-4 w-4 mr-3" />
                          Tithes
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Settings */}
                  <div className="space-y-2">
                    <Link to="/settings" onClick={closeMobileMenu}>
                      <Button 
                        variant={isActive('/settings') ? 'default' : 'ghost'} 
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Button>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-4 border-t">
                    <Button variant="outline" onClick={handleSignOut} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>  
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Church, Users, DollarSign, FileText, LogOut, Home, Database, MessageCircle, ChevronDown, UserCheck, Menu, ClipboardList, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/ui/theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const { user, signOut, userRole } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setThemeMenuOpen(false);
      }
    }
    if (themeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themeMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
      show: true
    },
    {
      href: '/messages',
      label: 'Messages',
      icon: MessageCircle,
      show: true
    },
    {
      href: '/tasks',
      label: 'Tasks',
      icon: ClipboardList,
      show: true
    },
    {
      href: '/forms',
      label: 'Forms',
      icon: FileText,
      show: true
    },
    {
      href: '/member-attendance',
      label: 'Attendance',
      icon: UserCheck,
      show: true
    },
    {
      href: '/tithes',
      label: 'Tithes',
      icon: DollarSign,
      show: userRole !== 'admin'
    },
    {
      href: '/members',
      label: 'Members',
      icon: Users,
      show: userRole === 'admin' || userRole === 'pastor'
    },
    {
      href: '/records',
      label: 'Records',
      icon: Database,
      show: userRole === 'admin'
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      show: true
    }
  ];

  const adminFinanceItems = [
    {
      href: '/tithes',
      label: 'Tithes',
      icon: DollarSign
    },
    {
      href: '/finances',
      label: 'Church Finances',
      icon: Database
    }
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
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {navigationItems.filter(item => item.show).map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button 
                    variant={isActive(item.href) ? 'default' : 'ghost'} 
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}

              {userRole === 'admin' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant={isActive('/tithes') || isActive('/finances') ? 'default' : 'ghost'} 
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Finance</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {adminFinanceItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link to={item.href} className="flex items-center space-x-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full capitalize">
                {userRole}
              </span>
              
              {/* Theme Switcher */}
              <div className="relative" ref={themeMenuRef}>
                <Button variant="outline" size="icon" className="mr-2" tabIndex={0} aria-label="Theme switcher" onClick={() => setThemeMenuOpen((v) => !v)}>
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                </Button>
                {themeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-card border rounded shadow-lg z-50">
                    <button className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted ${theme === 'light' ? 'font-bold' : ''}`} onClick={() => { setTheme('light'); setThemeMenuOpen(false); }}>
                      <Sun className="h-4 w-4 mr-2" /> Light
                    </button>
                    <button className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted ${theme === 'dark' ? 'font-bold' : ''}`} onClick={() => { setTheme('dark'); setThemeMenuOpen(false); }}>
                      <Moon className="h-4 w-4 mr-2" /> Dark
                    </button>
                    <button className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted ${theme === 'system' ? 'font-bold' : ''}`} onClick={() => { setTheme('system'); setThemeMenuOpen(false); }}>
                      <Monitor className="h-4 w-4 mr-2" /> System
                    </button>
                  </div>
                )}
              </div>
              
              <Button variant="outline" onClick={handleSignOut} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* User Info - Always Visible */}
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                {userRole}
              </span>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.user_metadata?.first_name || user?.email}
              </span>
            </div>

            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <Button variant="outline" size="icon" className="h-8 w-8" tabIndex={0} aria-label="Theme switcher" onClick={() => setThemeMenuOpen((v) => !v)}>
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </Button>
              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-card border rounded shadow-lg z-50">
                  <button className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted ${theme === 'light' ? 'font-bold' : ''}`} onClick={() => { setTheme('light'); setThemeMenuOpen(false); }}>
                    <Sun className="h-4 w-4 mr-2" /> Light
                  </button>
                  <button className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted ${theme === 'dark' ? 'font-bold' : ''}`} onClick={() => { setTheme('dark'); setThemeMenuOpen(false); }}>
                    <Moon className="h-4 w-4 mr-2" /> Dark
                  </button>
                  <button className={`w-full flex items-center px-3 py-2 text-sm hover:bg-muted ${theme === 'system' ? 'font-bold' : ''}`} onClick={() => { setTheme('system'); setThemeMenuOpen(false); }}>
                    <Monitor className="h-4 w-4 mr-2" /> System
                  </button>
                </div>
              )}
              
            </div>

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
                  {/* User Info in Mobile Menu */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm">Welcome, {user?.user_metadata?.first_name || user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">Role: {userRole}</p>
                  </div>
                  <Button variant="outline" onClick={handleSignOut} size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">Main Navigation</h3>
                    {navigationItems.filter(item => item.show).map((item) => (
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

                  {/* Admin Finance Section */}
                  {userRole === 'admin' && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground px-2">Finance</h3>
                      {adminFinanceItems.map((item) => (
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
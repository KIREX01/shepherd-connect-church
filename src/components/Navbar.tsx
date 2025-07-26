
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Church, Users, Calendar, DollarSign, FileText, LogOut, Home, Database, Heart, ChevronDown, UserCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/ui/theme-provider';
import { Sun, Moon, Monitor } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, signOut, userRole } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
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

  return (
    <nav className="border-b bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Church className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Church Management</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.first_name || user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
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

              <Link to="/forms">
                <Button 
                  variant={isActive('/forms') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Forms</span>
                </Button>
              </Link>

              <Link to="/member-attendance">
                <Button 
                  variant={isActive('/member-attendance') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Attendance</span>
                </Button>
              </Link>

              {userRole === 'admin' ? (
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
                    <DropdownMenuItem asChild>
                      <Link to="/tithes" className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Tithes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/finances" className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span>Church Finances</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
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

              {(userRole === 'admin' || userRole === 'pastor') && (
                <>
                  <Link to="/members">
                    <Button 
                      variant={isActive('/members') ? 'default' : 'ghost'} 
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>Members</span>
                    </Button>
                  </Link>

                  {userRole === 'admin' && (
                    <Link to="/records">
                      <Button 
                        variant={isActive('/records') ? 'default' : 'ghost'} 
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Database className="h-4 w-4" />
                        <span>Records</span>
                      </Button>
                    </Link>
                  )}
                </>
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
        </div>
      </div>
    </nav>
  );
}

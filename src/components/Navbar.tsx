
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Church, Users, Calendar, DollarSign, FileText, LogOut, Home, Database } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const { user, signOut, userRole } = useAuth();
  const location = useLocation();

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

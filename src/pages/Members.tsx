
import { UserManagement } from '@/components/UserManagement';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Members() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage church members and their roles in the system.
            </p>
          </div>
          
          <UserManagement />
        </div>
      </div>
      <Footer />
    </div>
  );
}


import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface MemberProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
  membership_date: string | null;
  created_at: string;
  user_roles: {
    role: string;
  }[];
}

export default function Members() {
  const { userRole } = useAuth();

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      console.log('Fetching members...');
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          phone,
          address,
          date_of_birth,
          membership_date,
          created_at,
          user_roles!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      console.log('Fetched members:', data);
      return data as MemberProfile[];
    },
    enabled: userRole === 'admin' || userRole === 'pastor',
  });

  // Show access denied if user is not admin or pastor
  if (userRole !== 'admin' && userRole !== 'pastor') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view member records.</p>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
            <p className="text-muted-foreground">Failed to load member records. Please try again.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Member Directory</h1>
              <p className="text-muted-foreground">View and manage registered church members</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Members</p>
                    <p className="text-2xl font-bold">{members?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">New This Month</p>
                    <p className="text-2xl font-bold">
                      {members?.filter(member => {
                        const memberDate = new Date(member.created_at);
                        const now = new Date();
                        return memberDate.getMonth() === now.getMonth() && 
                               memberDate.getFullYear() === now.getFullYear();
                      }).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Badge className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Roles</p>
                    <p className="text-2xl font-bold">
                      {new Set(members?.flatMap(m => m.user_roles.map(r => r.role))).size || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Members</CardTitle>
            <CardDescription>
              Complete list of all registered church members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!members || members.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No members found</p>
                <p className="text-sm">Members will appear here once they register</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Membership Date</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="font-medium">
                            {member.first_name && member.last_name 
                              ? `${member.first_name} ${member.last_name}`
                              : 'No name provided'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.user_roles.map((roleObj, index) => (
                              <Badge 
                                key={index} 
                                variant={roleObj.role === 'admin' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {roleObj.role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {member.phone && (
                              <div className="flex items-center space-x-1 text-sm">
                                <Phone className="h-3 w-3" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.address ? (
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">{member.address}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No address</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {member.date_of_birth ? (
                            format(new Date(member.date_of_birth), 'MMM dd, yyyy')
                          ) : (
                            <span className="text-muted-foreground text-sm">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {member.membership_date ? (
                            format(new Date(member.membership_date), 'MMM dd, yyyy')
                          ) : (
                            <span className="text-muted-foreground text-sm">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(member.created_at), 'MMM dd, yyyy')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

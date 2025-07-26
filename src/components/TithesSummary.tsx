import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Tithe {
  id: string;
  amount: number;
  tithe_date: string;
  category: string;
}

export function TithesSummary() {
  const { user, userRole } = useAuth();

  const { data: tithes, isLoading } = useQuery({
    queryKey: ['tithes-summary', user?.id],
    queryFn: async () => {
      let query = supabase.from('tithes').select('*').order('tithe_date', { ascending: false });
      
      // If user is not admin/pastor, only show their own tithes
      if (userRole !== 'admin' && userRole !== 'pastor') {
        query = query.eq('member_id', user?.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Tithe[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTithes = tithes?.reduce((sum, tithe) => sum + tithe.amount, 0) || 0;
  
  const currentMonthTithes = tithes?.filter(tithe => {
    const titheDate = new Date(tithe.tithe_date);
    const now = new Date();
    return titheDate.getMonth() === now.getMonth() && titheDate.getFullYear() === now.getFullYear();
  }).reduce((sum, tithe) => sum + tithe.amount, 0) || 0;

  const lastMonthTithes = tithes?.filter(tithe => {
    const titheDate = new Date(tithe.tithe_date);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return titheDate.getMonth() === lastMonth.getMonth() && titheDate.getFullYear() === lastMonth.getFullYear();
  }).reduce((sum, tithe) => sum + tithe.amount, 0) || 0;

  const monthOverMonthChange = lastMonthTithes > 0 
    ? ((currentMonthTithes - lastMonthTithes) / lastMonthTithes) * 100 
    : 0;

  const uniqueMembers = new Set(tithes?.map(tithe => tithe.id)).size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tithes & Offerings</span>
          <Link to="/tithes">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold">${totalTithes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold">${currentMonthTithes.toLocaleString()}</div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-3 w-3 ${monthOverMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-xs ${monthOverMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Records</span>
            </div>
            <div className="text-2xl font-bold">{tithes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg/Record</span>
            </div>
            <div className="text-2xl font-bold">
              ${tithes && tithes.length > 0 ? (totalTithes / tithes.length).toFixed(0) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">Per entry</p>
          </div>
        </div>
        
        {tithes && tithes.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {tithes.slice(0, 3).map((tithe) => (
                <div key={tithe.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{new Date(tithe.tithe_date).toLocaleDateString()}</span>
                  </div>
                  <span className="font-medium">${tithe.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
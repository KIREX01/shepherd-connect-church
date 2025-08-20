import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Plus, Eye, Edit, Trash2, Calendar, User } from 'lucide-react';

interface Tithe {
  id: string;
  user_id: string;
  amount: number;
  contribution_date: string;
  contribution_type: string;
  notes?: string;
  recorded_by: string;
  created_at: string;
}

interface TitheForm {
  amount: string;
  contribution_date: string;
  contribution_type: string;
  notes: string;
}

export function TithesTracker() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTithe, setEditingTithe] = useState<Tithe | null>(null);
  const [form, setForm] = useState<TitheForm>({
    amount: '',
    contribution_date: '',
    contribution_type: 'tithe',
    notes: '',
  });

  // Fetch contributions based on user role
  const { data: tithes, isLoading } = useQuery({
    queryKey: ['contributions', user?.id],
    queryFn: async () => {
      let query = supabase.from('contributions').select('*').order('contribution_date', { ascending: false });
      
      // If user is not admin/pastor, only show their own contributions
      if (userRole !== 'admin' && userRole !== 'pastor') {
        query = query.eq('user_id', user?.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Tithe[];
    },
  });

  // Fetch all members for admin/pastor selection
  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .order('first_name');
      if (error) throw error;
      return data;
    },
    enabled: userRole === 'admin' || userRole === 'pastor',
  });

  const createTitheMutation = useMutation({
    mutationFn: async (titheData: any) => {
      const { error } = await supabase.from('contributions').insert([titheData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast({ title: 'Success', description: 'Contribution record added successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating contribution:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to add contribution record', 
        variant: 'destructive' 
      });
    },
  });

  const updateTitheMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('contributions')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast({ title: 'Success', description: 'Contribution record updated successfully' });
      resetForm();
      setEditingTithe(null);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating contribution:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update contribution record', 
        variant: 'destructive' 
      });
    },
  });

  const deleteTitheMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contributions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast({ title: 'Success', description: 'Contribution record deleted successfully' });
    },
    onError: (error) => {
      console.error('Error deleting contribution:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete contribution record', 
        variant: 'destructive' 
      });
    },
  });

  const resetForm = () => {
    setForm({
      amount: '',
      contribution_date: '',
      contribution_type: 'tithe',
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const titheData = {
      user_id: user?.id,
      amount: parseFloat(form.amount),
      contribution_date: form.contribution_date,
      contribution_type: form.contribution_type,
      notes: form.notes || null,
      recorded_by: user?.id,
    };

    if (editingTithe) {
      updateTitheMutation.mutate({ id: editingTithe.id, data: titheData });
    } else {
      createTitheMutation.mutate(titheData);
    }
  };

  const handleEdit = (tithe: Tithe) => {
    setEditingTithe(tithe);
    setForm({
      amount: tithe.amount.toString(),
      contribution_date: tithe.contribution_date,
      contribution_type: tithe.contribution_type,
      notes: tithe.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tithe record?')) {
      deleteTitheMutation.mutate(id);
    }
  };

  const totalTithes = tithes?.reduce((sum, tithe) => sum + tithe.amount, 0) || 0;
  const currentMonthTithes = tithes?.filter(tithe => {
    const titheDate = new Date(tithe.contribution_date);
    const now = new Date();
    return titheDate.getMonth() === now.getMonth() && titheDate.getFullYear() === now.getFullYear();
  }).reduce((sum, tithe) => sum + tithe.amount, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tithes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTithes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthTithes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tithes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Tithe records</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Tithe Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tithes</h2>
          <p className="text-muted-foreground">
            {userRole === 'admin' || userRole === 'pastor' 
              ? 'Manage all member tithes' 
              : 'Track your tithe contributions'
            }
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setEditingTithe(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tithe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTithe ? 'Edit Tithe' : 'Add New Tithe'}
              </DialogTitle>
              <DialogDescription>
                {editingTithe ? 'Update the tithe record details.' : 'Record a new tithe contribution.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contribution_date">Date</Label>
                <Input
                  id="contribution_date"
                  type="date"
                  value={form.contribution_date}
                  onChange={(e) => setForm({ ...form, contribution_date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contribution_type">Type</Label>
                <Select value={form.contribution_type} onValueChange={(value) => setForm({ ...form, contribution_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tithe">Tithe</SelectItem>
                    <SelectItem value="offering">Offering</SelectItem>
                    <SelectItem value="special">Special Offering</SelectItem>
                    <SelectItem value="building">Building Fund</SelectItem>
                    <SelectItem value="mission">Mission Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional notes"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createTitheMutation.isPending || updateTitheMutation.isPending}>
                  {createTitheMutation.isPending || updateTitheMutation.isPending ? 'Saving...' : (editingTithe ? 'Update' : 'Add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tithes Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  {(userRole === 'admin' || userRole === 'pastor') && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tithes?.map((tithe) => (
                  <TableRow key={tithe.id}>
                    <TableCell>{new Date(tithe.contribution_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">${tithe.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tithe.contribution_type}</Badge>
                    </TableCell>
                    <TableCell>{tithe.notes || '-'}</TableCell>
                    {(userRole === 'admin' || userRole === 'pastor') && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tithe)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tithe.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {tithes?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={userRole === 'admin' || userRole === 'pastor' ? 5 : 4} className="text-center py-8">
                      No contribution records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
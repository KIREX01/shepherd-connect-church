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
  member_id: string;
  member_name: string;
  amount: number;
  tithe_date: string;
  payment_method: string;
  check_number?: string;
  category: string;
  is_anonymous: boolean;
  notes?: string;
  recorded_by: string;
  created_at: string;
}

interface TitheForm {
  member_name: string;
  amount: string;
  tithe_date: string;
  payment_method: string;
  check_number: string;
  category: string;
  is_anonymous: boolean;
  notes: string;
}

export function TithesTracker() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTithe, setEditingTithe] = useState<Tithe | null>(null);
  const [form, setForm] = useState<TitheForm>({
    member_name: '',
    amount: '',
    tithe_date: '',
    payment_method: 'cash',
    check_number: '',
    category: 'tithe',
    is_anonymous: false,
    notes: '',
  });

  // Fetch tithes based on user role
  const { data: tithes, isLoading } = useQuery({
    queryKey: ['tithes', user?.id],
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
    mutationFn: async (titheData: Partial<Tithe>) => {
      const { error } = await supabase.from('tithes').insert([titheData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tithes'] });
      toast({ title: 'Success', description: 'Tithe record added successfully' });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating tithe:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to add tithe record', 
        variant: 'destructive' 
      });
    },
  });

  const updateTitheMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Tithe> }) => {
      const { error } = await supabase
        .from('tithes')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tithes'] });
      toast({ title: 'Success', description: 'Tithe record updated successfully' });
      resetForm();
      setEditingTithe(null);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating tithe:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update tithe record', 
        variant: 'destructive' 
      });
    },
  });

  const deleteTitheMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tithes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tithes'] });
      toast({ title: 'Success', description: 'Tithe record deleted successfully' });
    },
    onError: (error) => {
      console.error('Error deleting tithe:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete tithe record', 
        variant: 'destructive' 
      });
    },
  });

  const resetForm = () => {
    setForm({
      member_name: userRole === 'admin' || userRole === 'pastor' ? '' : `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
      amount: '',
      tithe_date: '',
      payment_method: 'cash',
      check_number: '',
      category: 'tithe',
      is_anonymous: false,
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const titheData = {
      member_id: editingTithe?.member_id || user?.id,
      member_name: form.member_name,
      amount: parseFloat(form.amount),
      tithe_date: form.tithe_date,
      payment_method: form.payment_method,
      check_number: form.check_number || null,
      category: form.category,
      is_anonymous: form.is_anonymous,
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
      member_name: tithe.member_name,
      amount: tithe.amount.toString(),
      tithe_date: tithe.tithe_date,
      payment_method: tithe.payment_method,
      check_number: tithe.check_number || '',
      category: tithe.category,
      is_anonymous: tithe.is_anonymous,
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
    const titheDate = new Date(tithe.tithe_date);
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
              {(userRole === 'admin' || userRole === 'pastor') && (
                <div className="space-y-2">
                  <Label htmlFor="member_name">Member Name</Label>
                  <Input
                    id="member_name"
                    value={form.member_name}
                    onChange={(e) => setForm({ ...form, member_name: e.target.value })}
                    placeholder="Enter member name"
                    required
                  />
                </div>
              )}
              
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
                <Label htmlFor="tithe_date">Date</Label>
                <Input
                  id="tithe_date"
                  type="date"
                  value={form.tithe_date}
                  onChange={(e) => setForm({ ...form, tithe_date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select value={form.payment_method} onValueChange={(value) => setForm({ ...form, payment_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {form.payment_method === 'check' && (
                <div className="space-y-2">
                  <Label htmlFor="check_number">Check Number</Label>
                  <Input
                    id="check_number"
                    value={form.check_number}
                    onChange={(e) => setForm({ ...form, check_number: e.target.value })}
                    placeholder="Enter check number"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
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
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_anonymous"
                  checked={form.is_anonymous}
                  onCheckedChange={(checked) => setForm({ ...form, is_anonymous: checked as boolean })}
                />
                <Label htmlFor="is_anonymous">Anonymous donation</Label>
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
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Notes</TableHead>
                  {(userRole === 'admin' || userRole === 'pastor') && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tithes?.map((tithe) => (
                  <TableRow key={tithe.id}>
                    <TableCell>{new Date(tithe.tithe_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {tithe.is_anonymous ? (
                        <Badge variant="secondary">Anonymous</Badge>
                      ) : (
                        tithe.member_name
                      )}
                    </TableCell>
                    <TableCell className="font-medium">${tithe.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tithe.category}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{tithe.payment_method}</TableCell>
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
                    <TableCell colSpan={userRole === 'admin' || userRole === 'pastor' ? 7 : 6} className="text-center py-8">
                      No tithe records found
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
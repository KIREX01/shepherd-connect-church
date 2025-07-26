import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface FinanceForm {
  type: 'income' | 'expense';
  amount: string;
  date: string;
  description: string;
  category: string;
}

type ChurchFinance = any;

export default function ChurchFinances() {
  const { userRole, user } = useAuth();
  const { toast } = useToast();
  const [finances, setFinances] = useState<ChurchFinance[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FinanceForm>({
    type: 'income',
    amount: '',
    date: '',
    description: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userRole === 'admin') fetchFinances();
    // eslint-disable-next-line
  }, [userRole]);

  const fetchFinances = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('church_finances')
      .select('*')
      .order('date', { ascending: false });
    if (!error) setFinances(data as ChurchFinance[]);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await (supabase as any).from('church_finances').insert([
      {
        type: form.type,
        amount: Number(form.amount),
        date: form.date,
        description: form.description || null,
        category: form.category || null,
        recorded_by: user?.email || null,
      },
    ]);
    setSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: 'Failed to add record', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Finance record added' });
      setForm({ type: 'income', amount: '', date: '', description: '', category: '' });
      fetchFinances();
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + Number(f.amount), 0);
  const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + Number(f.amount), 0);
  const balance = totalIncome - totalExpense;

  // Fetch tithes data for additional context
  const [tithesTotal, setTithesTotal] = useState(0);
  
  useEffect(() => {
    const fetchTithesTotal = async () => {
      const { data, error } = await (supabase as any)
        .from('tithes')
        .select('amount');
      if (!error && data) {
        const total = data.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
        setTithesTotal(total);
      }
    };
    fetchTithesTotal();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Church Finance Tracking</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalExpense.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Tithes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${tithesTotal.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>${balance.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Finance Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium">Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-2 py-1">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Amount</label>
                <Input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Date</label>
                <Input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Category</label>
                <Input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Building Fund" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Description</label>
                <Input name="description" value={form.description} onChange={handleChange} placeholder="Optional details" />
              </div>
              <div className="md:col-span-5">
                <Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Record'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Finance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finances.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>{f.date}</TableCell>
                      <TableCell>{f.type.charAt(0).toUpperCase() + f.type.slice(1)}</TableCell>
                      <TableCell className={f.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        ${Number(f.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{f.category || '-'}</TableCell>
                      <TableCell>{f.description || '-'}</TableCell>
                      <TableCell>{f.recorded_by || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 
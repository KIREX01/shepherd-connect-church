
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Heart, Users, Lock } from 'lucide-react';

const prayerRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Please provide more details (minimum 10 characters)'),
  category: z.string().min(1, 'Category is required'),
  is_urgent: z.boolean().default(false),
  is_anonymous: z.boolean().default(false),
  is_private: z.boolean().default(false),
  requester_name: z.string().optional(),
  requester_email: z.string().email().optional(),
  requester_phone: z.string().optional(),
});

type PrayerRequestFormData = z.infer<typeof prayerRequestSchema>;

export function PrayerRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PrayerRequestFormData>({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      is_urgent: false,
      is_anonymous: false,
      is_private: false,
      requester_name: '',
      requester_email: '',
      requester_phone: '',
    },
  });

  const onSubmit = async (data: PrayerRequestFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('prayer_requests').insert([
        {
          ...data,
          user_id: user?.id,
          status: 'active',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Prayer Request Submitted',
        description: 'Your prayer request has been submitted successfully.',
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit prayer request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Submit Prayer Request
        </CardTitle>
        <CardDescription>
          Share your prayer needs with our church community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prayer Request Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief title for your prayer request" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide details about your prayer request..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="health">Health & Healing</SelectItem>
                      <SelectItem value="family">Family & Relationships</SelectItem>
                      <SelectItem value="work">Work & Career</SelectItem>
                      <SelectItem value="spiritual">Spiritual Growth</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="travel">Travel & Safety</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requester_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requester_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requester_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="is_urgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Urgent Request</FormLabel>
                      <FormDescription>
                        Mark this if immediate prayer is needed
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Submit Anonymously</FormLabel>
                      <FormDescription>
                        Your identity will not be shown with this request
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Private Request
                      </FormLabel>
                      <FormDescription>
                        Only pastoral staff will see this request
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

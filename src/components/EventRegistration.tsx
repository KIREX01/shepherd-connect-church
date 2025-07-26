
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  category: string;
  max_attendees: number | null;
  registration_required: boolean;
  cost: number | null;
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  registrations_count: number;
  user_registered: boolean;
}

export function EventRegistration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          registrations_count:event_registrations(count),
          user_registered:event_registrations!inner(user_id)
        `)
        .gte('event_date', new Date().toISOString())
        .eq('registration_required', true)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Process the data to check if user is registered
      const processedEvents = data?.map((event: any) => ({
        ...event,
        registrations_count: event.registrations_count?.[0]?.count || 0,
        user_registered: event.user_registered?.some((reg: any) => reg.user_id === user?.id) || false
      })) || [];

      setEvents(processedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to register for events',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await (supabase as any).from('event_registrations').insert([
        {
          event_id: eventId,
          user_id: user.id,
          registration_date: new Date().toISOString(),
          status: 'confirmed',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Registration Successful',
        description: 'You have been registered for this event',
      });

      // Refresh events to update registration status
      fetchEvents();
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: 'Registration Failed',
        description: 'Failed to register for event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('event_registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: 'Registration Cancelled',
        description: 'You have been unregistered from this event',
      });

      // Refresh events to update registration status
      fetchEvents();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel registration. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <Badge variant="outline">{events.length} events available</Badge>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No upcoming events requiring registration</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(event.event_date), 'MMM dd, yyyy')}
                  </div>
                  {event.start_time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.start_time}
                      {event.end_time && ` - ${event.end_time}`}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {event.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.registrations_count} registered</span>
                      {event.max_attendees && (
                        <span>/ {event.max_attendees} max</span>
                      )}
                    </div>
                    {event.cost && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${Number(event.cost).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {event.user_registered ? (
                      <>
                        <Badge variant="default">Registered</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnregister(event.id)}
                        >
                          Cancel Registration
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleRegister(event.id)}
                        disabled={event.max_attendees && event.registrations_count >= event.max_attendees}
                      >
                        {event.max_attendees && event.registrations_count >= event.max_attendees 
                          ? 'Event Full' 
                          : 'Register'
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

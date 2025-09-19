
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Clock, User, Lock, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PrayerRequestStatusModal } from './PrayerRequestStatusModal';

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  is_urgent: boolean;
  is_anonymous: boolean;
  is_private: boolean;
  requester_name: string | null;
  requester_email: string | null;
  requester_phone: string | null;
  status: string;
  created_at: string;
  prayers_count: number;
  pastoral_response?: string;
  responded_at?: string;
  responded_by?: string;
  user_id?: string | null;
}

export function PrayerRequestsList() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      // Use the secure query that respects RLS policies
      const { data, error } = await supabase
        .from('prayer_requests')
        .select(`
          *,
          prayers_count:prayer_responses(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayerRequests(
        (data || []).map((req: any) => ({
          ...req,
          prayers_count: Array.isArray(req.prayers_count) && req.prayers_count.length > 0
            ? req.prayers_count[0].count
            : 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load prayer requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrayForRequest = async (requestId: string) => {
    try {
      const { error } = await supabase.from('prayer_responses').insert([
        {
          prayer_request_id: requestId,
          user_id: user?.id,
          response_type: 'prayed',
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Thank You',
        description: 'Your prayer has been recorded',
      });

      // Refresh the list to update prayer counts
      fetchPrayerRequests();
    } catch (error) {
      console.error('Error recording prayer:', error);
      toast({
        title: 'Error',
        description: 'Failed to record prayer',
        variant: 'destructive',
      });
    }
  };

  const handleStatusUpdate = async (requestId: string, status: string, response?: string) => {
    try {
      const updateData: any = {
        status,
        responded_at: new Date().toISOString(),
        responded_by: user?.id,
      };

      if (response) {
        updateData.pastoral_response = response;
      }

      const { error } = await supabase
        .from('prayer_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Prayer request marked as ${status}`,
      });

      fetchPrayerRequests();
      setShowStatusModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating prayer request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prayer request',
        variant: 'destructive',
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-red-100 text-red-800',
      family: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      spiritual: 'bg-purple-100 text-purple-800',
      financial: 'bg-yellow-100 text-yellow-800',
      travel: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'answered':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Answered
        </Badge>;
      case 'ongoing':
        return <Badge className="bg-yellow-100 text-yellow-800">Ongoing Prayer</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <h2 className="text-2xl font-semibold">Prayer Requests</h2>
        <Badge variant="outline">{prayerRequests.length} requests</Badge>
      </div>

      {prayerRequests.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No prayer requests at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prayerRequests.map((request) => (
            <Card key={request.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{request.title}</CardTitle>
                    {request.is_urgent && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Urgent
                      </Badge>
                    )}
                    {request.is_private && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}
                    {getStatusBadge(request.status)}
                  </div>
                  <Badge className={getCategoryColor(request.category)}>
                    {request.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {request.is_anonymous ? 'Anonymous' : 
                     (userRole === 'admin' || userRole === 'pastor' || request.user_id === user?.id) 
                       ? (request.requester_name || 'Church Member')
                       : 'Church Member'
                    }
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(request.created_at), 'MMM dd, yyyy')}
                  </div>
                  {/* Show contact info only to authorized users */}
                  {(userRole === 'admin' || userRole === 'pastor' || request.user_id === user?.id) && 
                   (request.requester_email || request.requester_phone) && (
                    <div className="text-xs">
                      {request.requester_email && <div>📧 {request.requester_email}</div>}
                      {request.requester_phone && <div>📞 {request.requester_phone}</div>}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {request.description}
                </p>

                {request.pastoral_response && (
                  <div className="bg-muted p-3 rounded-md mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Pastoral Response</span>
                    </div>
                    <p className="text-sm">{request.pastoral_response}</p>
                    {request.responded_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded on {format(new Date(request.responded_at), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span>{request.prayers_count} prayers</span>
                  </div>
                  <div className="flex gap-2">
                    {request.status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => handlePrayForRequest(request.id)}
                        className="flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        I Prayed
                      </Button>
                    )}
                    {(userRole === 'admin' || userRole === 'pastor') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowStatusModal(true);
                        }}
                      >
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showStatusModal && selectedRequest && (
        <PrayerRequestStatusModal
          request={selectedRequest}
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRequest(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

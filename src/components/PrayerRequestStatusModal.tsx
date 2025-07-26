
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { User, Clock, AlertCircle, Lock } from 'lucide-react';

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
}

interface PrayerRequestStatusModalProps {
  request: PrayerRequest;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (requestId: string, status: string, response?: string) => void;
}

export function PrayerRequestStatusModal({
  request,
  isOpen,
  onClose,
  onUpdate,
}: PrayerRequestStatusModalProps) {
  const [status, setStatus] = useState(request.status);
  const [response, setResponse] = useState(request.pastoral_response || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate(request.id, status, response);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Prayer Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{request.title}</h3>
                  <div className="flex gap-2">
                    {request.is_urgent && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        Urgent
                      </div>
                    )}
                    {request.is_private && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Lock className="h-4 w-4" />
                        Private
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {request.is_anonymous ? 'Anonymous' : request.requester_name || 'Church Member'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(request.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {request.category}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{request.description}</p>

                {/* Contact Information (if not anonymous) */}
                {!request.is_anonymous && (request.requester_email || request.requester_phone) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      {request.requester_email && (
                        <p><strong>Email:</strong> {request.requester_email}</p>
                      )}
                      {request.requester_phone && (
                        <p><strong>Phone:</strong> {request.requester_phone}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <strong>{request.prayers_count}</strong> people have prayed for this request
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">Update Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="ongoing">Ongoing Prayer</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="response">Pastoral Response (Optional)</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Add a pastoral response or update..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Request'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

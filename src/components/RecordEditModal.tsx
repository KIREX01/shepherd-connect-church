import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RecordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordType: 'member_registrations' | 'events' | 'attendance_records' | 'donation_records';
  record?: any;
  onSuccess: () => void;
}

export function RecordEditModal({ isOpen, onClose, recordType, record, onSuccess }: RecordEditModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (record) {
      setFormData(record);
    } else {
      // Reset form for new record
      setFormData(getDefaultFormData(recordType));
    }
  }, [record, recordType]);

  const getDefaultFormData = (type: string) => {
    switch (type) {
      case 'member_registrations':
        return {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          date_of_birth: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          membership_type: 'regular',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          notes: ''
        };
      case 'events':
        return {
          title: '',
          description: '',
          event_date: '',
          location: '',
          start_time: '',
          end_time: '',
          category: 'other',
          max_attendees: null,
          registration_required: false,
          cost: null,
          contact_person: '',
          contact_email: '',
          contact_phone: '',
          is_public: true,
          requires_childcare: false,
          notes: ''
        };
      case 'attendance_records':
        return {
          service_date: '',
          service_type: 'sunday_service',
          total_attendance: 0,
          adult_count: 0,
          child_count: 0,
          visitor_count: 0,
          first_time_visitors: 0,
          special_notes: ''
        };
      case 'donation_records':
        return {
          donor_name: '',
          donor_email: '',
          donor_phone: '',
          amount: '',
          donation_date: '',
          payment_method: 'cash',
          check_number: '',
          category: 'general',
          is_anonymous: false,
          is_recurring: false,
          tax_deductible: true,
          notes: ''
        };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user for recorded_by/created_by fields
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ 
          title: 'Error', 
          description: 'You must be logged in to perform this action', 
          variant: 'destructive' 
        });
        setLoading(false);
        return;
      }

      let dataToSubmit = { ...formData };
      
      // Convert numeric fields with proper validation
      if (recordType === 'attendance_records') {
        dataToSubmit.total_attendance = parseInt(dataToSubmit.total_attendance) || 0;
        dataToSubmit.adult_count = parseInt(dataToSubmit.adult_count) || 0;
        dataToSubmit.child_count = parseInt(dataToSubmit.child_count) || 0;
        dataToSubmit.visitor_count = parseInt(dataToSubmit.visitor_count) || 0;
        dataToSubmit.first_time_visitors = parseInt(dataToSubmit.first_time_visitors) || 0;
      }
      
      if (recordType === 'donation_records') {
        dataToSubmit.amount = parseFloat(dataToSubmit.amount) || 0;
      }

      if (recordType === 'events') {
        if (dataToSubmit.max_attendees) {
          dataToSubmit.max_attendees = parseInt(dataToSubmit.max_attendees) || null;
        }
        if (dataToSubmit.cost) {
          dataToSubmit.cost = parseFloat(dataToSubmit.cost) || null;
        }
      }

      if (record) {
        // Update existing record
        const { error } = await supabase
          .from(recordType)
          .update(dataToSubmit)
          .eq('id', record.id);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Record updated successfully' });
      } else {
        // Create new record - add recorded_by or created_by field
        if (recordType === 'attendance_records' || recordType === 'donation_records' || recordType === 'member_registrations') {
          dataToSubmit.recorded_by = user.id;
        }
        if (recordType === 'events') {
          dataToSubmit.created_by = user.id;
        }
        
        const { error } = await supabase
          .from(recordType)
          .insert([dataToSubmit]);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Record created successfully' });
      }

      // Ensure data refresh happens before closing
      await onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving record:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save record', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderMemberForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input
          id="first_name"
          value={formData.first_name || ''}
          onChange={(e) => handleInputChange('first_name', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input
          id="last_name"
          value={formData.last_name || ''}
          onChange={(e) => handleInputChange('last_name', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="date_of_birth">Date of Birth</Label>
        <Input
          id="date_of_birth"
          type="date"
          value={formData.date_of_birth || ''}
          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="membership_type">Membership Type</Label>
        <Select value={formData.membership_type || 'regular'} onValueChange={(value) => handleInputChange('membership_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="associate">Associate</SelectItem>
            <SelectItem value="visitor">Visitor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={formData.city || ''}
          onChange={(e) => handleInputChange('city', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={formData.state || ''}
          onChange={(e) => handleInputChange('state', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="zip_code">ZIP Code</Label>
        <Input
          id="zip_code"
          value={formData.zip_code || ''}
          onChange={(e) => handleInputChange('zip_code', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
        <Input
          id="emergency_contact_name"
          value={formData.emergency_contact_name || ''}
          onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
        <Input
          id="emergency_contact_phone"
          value={formData.emergency_contact_phone || ''}
          onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
          required
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderEventForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_date">Event Date</Label>
          <Input
            id="event_date"
            type="date"
            value={formData.event_date || ''}
            onChange={(e) => handleInputChange('event_date', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category || 'other'} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="fellowship">Fellowship</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="outreach">Outreach</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time || ''}
            onChange={(e) => handleInputChange('start_time', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time || ''}
            onChange={(e) => handleInputChange('end_time', e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost || ''}
            onChange={(e) => handleInputChange('cost', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="max_attendees">Max Attendees</Label>
          <Input
            id="max_attendees"
            type="number"
            value={formData.max_attendees || ''}
            onChange={(e) => handleInputChange('max_attendees', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            value={formData.contact_person || ''}
            onChange={(e) => handleInputChange('contact_person', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email || ''}
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="contact_phone">Contact Phone</Label>
        <Input
          id="contact_phone"
          value={formData.contact_phone || ''}
          onChange={(e) => handleInputChange('contact_phone', e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="registration_required"
            checked={formData.registration_required || false}
            onCheckedChange={(checked) => handleInputChange('registration_required', checked)}
          />
          <Label htmlFor="registration_required">Registration Required</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="requires_childcare"
            checked={formData.requires_childcare || false}
            onCheckedChange={(checked) => handleInputChange('requires_childcare', checked)}
          />
          <Label htmlFor="requires_childcare">Requires Childcare</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_public"
            checked={formData.is_public !== false}
            onCheckedChange={(checked) => handleInputChange('is_public', checked)}
          />
          <Label htmlFor="is_public">Public Event</Label>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderAttendanceForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="service_date">Service Date</Label>
        <Input
          id="service_date"
          type="date"
          value={formData.service_date || ''}
          onChange={(e) => handleInputChange('service_date', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="service_type">Service Type</Label>
        <Select value={formData.service_type || 'sunday_service'} onValueChange={(value) => handleInputChange('service_type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sunday_service">Sunday Service</SelectItem>
            <SelectItem value="wednesday_service">Wednesday Service</SelectItem>
            <SelectItem value="prayer_meeting">Prayer Meeting</SelectItem>
            <SelectItem value="bible_study">Bible Study</SelectItem>
            <SelectItem value="youth_group">Youth Group</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="total_attendance">Total Attendance</Label>
        <Input
          id="total_attendance"
          type="number"
          value={formData.total_attendance || 0}
          onChange={(e) => handleInputChange('total_attendance', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="adult_count">Adult Count</Label>
        <Input
          id="adult_count"
          type="number"
          value={formData.adult_count || 0}
          onChange={(e) => handleInputChange('adult_count', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="child_count">Child Count</Label>
        <Input
          id="child_count"
          type="number"
          value={formData.child_count || 0}
          onChange={(e) => handleInputChange('child_count', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="visitor_count">Visitor Count</Label>
        <Input
          id="visitor_count"
          type="number"
          value={formData.visitor_count || 0}
          onChange={(e) => handleInputChange('visitor_count', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="first_time_visitors">First Time Visitors</Label>
        <Input
          id="first_time_visitors"
          type="number"
          value={formData.first_time_visitors || 0}
          onChange={(e) => handleInputChange('first_time_visitors', e.target.value)}
          required
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="special_notes">Special Notes</Label>
        <Textarea
          id="special_notes"
          value={formData.special_notes || ''}
          onChange={(e) => handleInputChange('special_notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderDonationForm = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="donor_name">Donor Name</Label>
        <Input
          id="donor_name"
          value={formData.donor_name || ''}
          onChange={(e) => handleInputChange('donor_name', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount || ''}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="donor_email">Donor Email</Label>
        <Input
          id="donor_email"
          type="email"
          value={formData.donor_email || ''}
          onChange={(e) => handleInputChange('donor_email', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="donor_phone">Donor Phone</Label>
        <Input
          id="donor_phone"
          value={formData.donor_phone || ''}
          onChange={(e) => handleInputChange('donor_phone', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="donation_date">Donation Date</Label>
        <Input
          id="donation_date"
          type="date"
          value={formData.donation_date || ''}
          onChange={(e) => handleInputChange('donation_date', e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="payment_method">Payment Method</Label>
        <Select value={formData.payment_method || 'cash'} onValueChange={(value) => handleInputChange('payment_method', value)}>
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
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category || 'general'} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="building_fund">Building Fund</SelectItem>
            <SelectItem value="mission_fund">Mission Fund</SelectItem>
            <SelectItem value="special_project">Special Project</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="check_number">Check Number</Label>
        <Input
          id="check_number"
          value={formData.check_number || ''}
          onChange={(e) => handleInputChange('check_number', e.target.value)}
        />
      </div>
      <div className="col-span-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={formData.is_anonymous || false}
              onCheckedChange={(checked) => handleInputChange('is_anonymous', checked)}
            />
            <Label htmlFor="is_anonymous">Anonymous Donation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_recurring"
              checked={formData.is_recurring || false}
              onCheckedChange={(checked) => handleInputChange('is_recurring', checked)}
            />
            <Label htmlFor="is_recurring">Recurring Donation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tax_deductible"
              checked={formData.tax_deductible !== false}
              onCheckedChange={(checked) => handleInputChange('tax_deductible', checked)}
            />
            <Label htmlFor="tax_deductible">Tax Deductible</Label>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderVolunteerForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name || ''}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name || ''}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Textarea
          id="skills"
          value={formData.skills || ''}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="experience">Experience</Label>
        <Textarea
          id="experience"
          value={formData.experience || ''}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
          <Input
            id="emergency_contact_name"
            value={formData.emergency_contact_name || ''}
            onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_contact_phone"
            value={formData.emergency_contact_phone || ''}
            onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="background_check_consent"
          checked={formData.background_check_consent || false}
          onCheckedChange={(checked) => handleInputChange('background_check_consent', checked)}
        />
        <Label htmlFor="background_check_consent">Background Check Consent</Label>
      </div>
      <div>
        <Label htmlFor="additional_notes">Additional Notes</Label>
        <Textarea
          id="additional_notes"
          value={formData.additional_notes || ''}
          onChange={(e) => handleInputChange('additional_notes', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (recordType) {
      case 'member_registrations':
        return renderMemberForm();
      case 'events':
        return renderEventForm();
      case 'attendance_records':
        return renderAttendanceForm();
      case 'donation_records':
        return renderDonationForm();
      default:
        return <div>Unknown record type</div>;
    }
  };

  const getTitle = () => {
    const action = record ? 'Edit' : 'Add';
    const type = recordType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${action} ${type}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {record ? 'Update the record details below.' : 'Fill in the details to create a new record.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderForm()}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (record ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
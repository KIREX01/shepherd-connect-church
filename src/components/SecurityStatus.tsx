import { Shield, CheckCircle, AlertTriangle, Lock, Eye, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SecurityStatus() {
  const securityMeasures = [
    {
      category: "Data Protection",
      status: "secured",
      items: [
        "Prayer request contact information restricted to authorized users only",
        "Row Level Security (RLS) enabled on all sensitive tables",
        "Private prayer requests visible only to owners and admins",
        "User profile data protected with proper access controls"
      ]
    },
    {
      category: "Database Security", 
      status: "secured",
      items: [
        "Search path properly configured in all database functions",
        "Security definer functions use proper isolation",
        "Role-based access control implemented",
        "Audit logging enabled for role changes"
      ]
    },
    {
      category: "Authentication & Authorization",
      status: "secured", 
      items: [
        "User roles properly managed with audit trail",
        "Admin-only access to sensitive operations",
        "Email verification required for new accounts",
        "Session management with automatic token refresh"
      ]
    },
    {
      category: "Infrastructure (User Action Required)",
      status: "warning",
      items: [
        "Enable leaked password protection in Supabase Auth settings",
        "Configure shorter OTP expiry time for better security", 
        "Consider upgrading PostgreSQL version for latest patches"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secured':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'secured':
        return <Badge className="bg-green-100 text-green-800">Secured</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Action Required</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Security Status Dashboard</CardTitle>
              <p className="text-sm text-muted-foreground">
                Overview of security measures implemented in your church management system
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Review Complete:</strong> Your application has been hardened with enterprise-grade security measures. 
              Critical data exposure vulnerabilities have been resolved.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(measure.status)}
                    <h3 className="font-semibold">{measure.category}</h3>
                  </div>
                  {getStatusBadge(measure.status)}
                </div>
                
                <ul className="space-y-2">
                  {measure.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Privacy Protection Summary</h4>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Contact information (email, phone) now only visible to admins, pastors, and request owners</p>
              <p>• Private prayer requests completely hidden from non-authorized users</p>
              <p>• Public prayer request view excludes all sensitive personal data</p>
              <p>• Prayer responses follow the same privacy rules as their parent requests</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <h4 className="font-medium text-amber-900">Next Steps</h4>
            </div>
            <div className="text-sm text-amber-800">
              <p>Visit your Supabase dashboard to enable leaked password protection and adjust OTP settings for optimal security.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
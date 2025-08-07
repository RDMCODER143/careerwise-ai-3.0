
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Building2, 
  Bell, 
  Shield,
  CreditCard,
  Users,
  Mail,
  Globe
} from "lucide-react";

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <AppSidebar userRole="employer" />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl space-y-6">
          {/* Company Information */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    defaultValue="TechCorp Solutions" 
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    defaultValue="Technology" 
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-size">Company Size</Label>
                  <Input 
                    id="company-size" 
                    defaultValue="50-100 employees" 
                    placeholder="e.g., 10-50, 100-500"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    defaultValue="https://techcorp.com" 
                    placeholder="https://yourcompany.com"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company-description">Company Description</Label>
                <Textarea 
                  id="company-description" 
                  defaultValue="We are a leading technology company focused on innovative solutions..."
                  placeholder="Brief description of your company"
                  className="min-h-[100px]"
                />
              </div>

              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Save Company Information
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-person">Contact Person</Label>
                  <Input 
                    id="contact-person" 
                    defaultValue="John Doe" 
                    placeholder="Primary contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input 
                    id="job-title" 
                    defaultValue="HR Manager" 
                    placeholder="e.g., HR Manager, Recruiter"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue="john.doe@techcorp.com" 
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    defaultValue="+1 (555) 123-4567" 
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <Button variant="outline">
                Update Contact Information
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-applications">New Applications</Label>
                  <p className="text-sm text-gray-600">Get notified when someone applies for your jobs</p>
                </div>
                <Switch id="new-applications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="interview-reminders">Interview Reminders</Label>
                  <p className="text-sm text-gray-600">Reminders for scheduled interviews</p>
                </div>
                <Switch id="interview-reminders" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="job-expiry">Job Expiry Alerts</Label>
                  <p className="text-sm text-gray-600">Get alerts when job postings are about to expire</p>
                </div>
                <Switch id="job-expiry" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Receive weekly hiring performance reports</p>
                </div>
                <Switch id="weekly-reports" />
              </div>

              <Button variant="outline">
                Save Notification Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Switch id="two-factor" />
              </div>

              <Button variant="outline">
                Update Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Billing & Subscription */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-900">Professional Plan</h3>
                    <p className="text-green-700 text-sm">Active until March 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-900">$99</p>
                    <p className="text-sm text-green-700">per month</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Change Plan
                </Button>
                <Button variant="outline" className="flex-1">
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

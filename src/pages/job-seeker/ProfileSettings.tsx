
import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Settings,
  Bell,
  Shield,
  Save,
  Upload,
  Trash2,
  Plus,
  X,
  Loader2
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    bio: '',
    currentTitle: '',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    degree: '',
    major: '',
    school: '',
    graduationYear: ''
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const availableSkills = [
    "Vue.js", "Angular", "Kubernetes", "Redis", "Elasticsearch",
    "Go", "Rust", "Java", "Spring Boot", "Django", "React", "Node.js",
    "Python", "JavaScript", "TypeScript", "Docker", "AWS", "MongoDB"
  ];

  // Load user data on component mount
  useEffect(() => {
    if (profile && user) {
      const nameParts = profile.full_name?.split(' ') || [];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: profile.phone || '',
        city: profile.city || '',
        country: profile.country || '',
        bio: profile.bio || '',
        currentTitle: profile.current_title || '',
        experience: profile.experience || '',
        currentCompany: profile.current_company || '',
        expectedSalary: profile.expected_salary || '',
        degree: profile.degree || '',
        major: profile.major || '',
        school: profile.school || '',
        graduationYear: profile.graduation_year || ''
      });

      setSkills(profile.skills || []);
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    try {
      // Update profile with all the new data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          city: formData.city,
          country: formData.country,
          bio: formData.bio,
          current_title: formData.currentTitle,
          experience: formData.experience,
          current_company: formData.currentCompany,
          expected_salary: formData.expectedSalary,
          degree: formData.degree,
          major: formData.major,
          school: formData.school,
          graduation_year: formData.graduationYear,
          skills: skills,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Success',
        description: 'Profile updated successfully! Changes will be reflected immediately.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-subtle font-poppins">
        <AppSidebar userRole="job_seeker" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-hero text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-white/90 text-lg">
              Manage your profile information and preferences
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Personal Information */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.profile_photo_url ? (
                    <img 
                      src={profile.profile_photo_url} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span>{formData.firstName?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number" 
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Summary</Label>
                <Textarea 
                  id="bio" 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Write a brief summary about your professional experience and goals..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentTitle">Current Job Title</Label>
                  <Input 
                    id="currentTitle" 
                    value={formData.currentTitle}
                    onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                    placeholder="e.g., Frontend Developer" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="4-5">4-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input 
                    id="currentCompany" 
                    value={formData.currentCompany}
                    onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                    placeholder="Enter company name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary Range</Label>
                  <Input 
                    id="expectedSalary" 
                    value={formData.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    placeholder="e.g., ₹80k - ₹120k" 
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="w-40"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                    />
                    <Button size="sm" onClick={() => addSkill(newSkill)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Add from suggestions:</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => addSkill(skill)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input 
                    id="degree" 
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    placeholder="e.g., Bachelor of Science" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Field of Study</Label>
                  <Input 
                    id="major" 
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    placeholder="e.g., Computer Science" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School/University</Label>
                  <Input 
                    id="school" 
                    value={formData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    placeholder="Enter school name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select value={formData.graduationYear} onValueChange={(value) => handleInputChange('graduationYear', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Notifications */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Privacy & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Privacy Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Allow recruiters to find your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Salary Expectations</p>
                      <p className="text-sm text-muted-foreground">Display salary range to employers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Contact Information</p>
                      <p className="text-sm text-muted-foreground">Allow employers to contact you directly</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notification Preferences
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Job Recommendations</p>
                      <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-muted-foreground">Status changes on your applications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Interview Reminders</p>
                      <p className="text-sm text-muted-foreground">Reminders for scheduled interviews</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Career Tips</p>
                      <p className="text-sm text-muted-foreground">Helpful tips and industry insights</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button 
              className="bg-gradient-hero hover:opacity-90"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;


import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Award,
  Settings,
  Bell,
  Shield,
  Upload,
  X,
  Plus,
  Loader2
} from "lucide-react";

const ProfileSettings: React.FC = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Profile form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    currentRole: '',
    experience: '',
    currentCompany: '',
    expectedSalary: '',
    degree: '',
    university: '',
    graduationYear: '',
    gpa: ''
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Notification preferences
  const [notifications, setNotifications] = useState({
    jobRecommendations: true,
    applicationUpdates: true,
    interviewReminders: true,
    careerTips: false
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showActivityStatus: true
  });

  // Load profile data on component mount
  useEffect(() => {
    if (profile) {
      const nameParts = profile.full_name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user?.email || '',
        phone: profile.phone || '',
        location: `${profile.city || ''} ${profile.country || ''}`.trim(),
        bio: profile.bio || '',
        currentRole: profile.current_title || '',
        experience: profile.experience || '',
        currentCompany: profile.current_company || '',
        expectedSalary: profile.expected_salary || '',
        degree: profile.degree || '',
        university: profile.school || '',
        graduationYear: profile.graduation_year || '',
        gpa: ''
      });
      setSkills(profile.skills || []);
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update profile with photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Photo Updated",
        description: "Profile photo has been updated successfully!",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsLoading(true);
    try {
      const updatedProfile = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        city: formData.location.split(' ')[0] || '',
        country: formData.location.split(' ').slice(1).join(' ') || '',
        bio: formData.bio,
        current_title: formData.currentRole,
        experience: formData.experience,
        current_company: formData.currentCompany,
        expected_salary: formData.expectedSalary,
        degree: formData.degree,
        school: formData.university,
        graduation_year: formData.graduationYear,
        skills: skills,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-[#9b2c2c] to-red-900 text-white p-6 shadow-elegant">
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
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <User className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-[#9b2c2c] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.profile_photo_url ? (
                    <img 
                      src={profile.profile_photo_url} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(profile?.full_name || 'U')
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button 
                      className="bg-gradient-to-r from-[#9b2c2c] to-red-900 hover:from-red-900 hover:to-red-950 text-white"
                      disabled={isUploading}
                      asChild
                    >
                      <span>
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      id="email" 
                      className="pl-10" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@example.com"
                      disabled
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      id="phone" 
                      className="pl-10" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="location" 
                    className="pl-10" 
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself, your experience, and career goals..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Input 
                    id="currentRole" 
                    value={formData.currentRole}
                    onChange={(e) => handleInputChange('currentRole', e.target.value)}
                    placeholder="Frontend Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input 
                    id="experience" 
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Current Company</Label>
                  <Input 
                    id="currentCompany" 
                    value={formData.currentCompany}
                    onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                    placeholder="TechCorp Solutions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">Expected Salary (LPA)</Label>
                  <Input 
                    id="expectedSalary" 
                    value={formData.expectedSalary}
                    onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                    placeholder="15-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <Award className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Skills & Technologies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-50 text-[#9b2c2c] hover:bg-red-100">
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a new skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button 
                  onClick={addSkill}
                  className="bg-gradient-to-r from-[#9b2c2c] to-red-900 hover:from-red-900 hover:to-red-950 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Highest Degree</Label>
                  <Input 
                    id="degree" 
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    placeholder="B.Tech Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University/College</Label>
                  <Input 
                    id="university" 
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    placeholder="Indian Institute of Technology"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input 
                    id="graduationYear" 
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    placeholder="2021"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA/Percentage</Label>
                  <Input 
                    id="gpa" 
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    placeholder="8.5/10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <Bell className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Job Recommendations</p>
                  <p className="text-sm text-muted-foreground">Get notified about new job matches</p>
                </div>
                <Switch 
                  checked={notifications.jobRecommendations}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, jobRecommendations: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Application Updates</p>
                  <p className="text-sm text-muted-foreground">Updates on your job applications</p>
                </div>
                <Switch 
                  checked={notifications.applicationUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, applicationUpdates: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Interview Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders for scheduled interviews</p>
                </div>
                <Switch 
                  checked={notifications.interviewReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, interviewReminders: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Career Tips</p>
                  <p className="text-sm text-muted-foreground">Weekly career advice and tips</p>
                </div>
                <Switch 
                  checked={notifications.careerTips}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, careerTips: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#9b2c2c]/10 rounded-lg">
                  <Shield className="w-5 h-5 text-[#9b2c2c]" />
                </div>
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Visibility</p>
                  <p className="text-sm text-muted-foreground">Make your profile visible to recruiters</p>
                </div>
                <Switch 
                  checked={privacy.profileVisibility}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profileVisibility: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Activity Status</p>
                  <p className="text-sm text-muted-foreground">Show when you're actively looking for jobs</p>
                </div>
                <Switch 
                  checked={privacy.showActivityStatus}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showActivityStatus: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#9b2c2c] to-red-900 hover:from-red-900 hover:to-red-950 text-white px-8"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;

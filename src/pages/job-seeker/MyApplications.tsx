
import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calendar, 
  Clock, 
  MapPin, 
  Building, 
  Briefcase,
  Video,
  Phone,
  User,
  ExternalLink,
  DollarSign,
  Users,
  ArrowRight,
  Loader2,
  Trash2
} from "lucide-react";
import { useCandidates } from '@/hooks/useCandidates';
import { useInterviews } from '@/hooks/useInterviews';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MyApplications = () => {
  const { candidates, isLoading: candidatesLoading } = useCandidates();
  const { interviews, isLoading: interviewsLoading } = useInterviews();
  const [realTimeInterviews, setRealTimeInterviews] = useState(interviews);
  const [deletingApplications, setDeletingApplications] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Real-time updates for interviews
  useEffect(() => {
    setRealTimeInterviews(interviews);
  }, [interviews]);

  useEffect(() => {
    const channel = supabase
      .channel('interviews_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'interviews' },
        (payload) => {
          console.log('Real-time interview update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setRealTimeInterviews(prev => [...prev, payload.new as any]);
          } else if (payload.eventType === 'UPDATE') {
            setRealTimeInterviews(prev => 
              prev.map(interview => 
                interview.id === payload.new.id ? { ...interview, ...payload.new } : interview
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setRealTimeInterviews(prev => 
              prev.filter(interview => interview.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteApplication = async (applicationId: string) => {
    setDeletingApplications(prev => new Set(prev).add(applicationId));

    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', applicationId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete application',
        variant: 'destructive',
      });
    } finally {
      setDeletingApplications(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Application': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Phone Screen': return 'bg-purple-100 text-purple-800';
      case 'Interview Scheduled': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Hired': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterviewStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-green-100 text-green-800 border-green-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Rescheduled': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <Video className="w-4 h-4" />;
      case 'Phone Screen': return <Phone className="w-4 h-4" />;
      case 'In-Person': return <User className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `From ₹${min.toLocaleString()}`;
    if (max) return `Up to ₹${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  // Get interviews for current user's applications using real-time data
  const userInterviews = realTimeInterviews.filter(interview => 
    candidates.some(candidate => candidate.id === interview.candidate_id)
  );

  const upcomingInterviews = userInterviews.filter(interview => {
    if (!interview.scheduled_at) return false;
    return new Date(interview.scheduled_at) > new Date() && interview.status === 'Scheduled';
  });

  const pastInterviews = userInterviews.filter(interview => {
    if (!interview.scheduled_at) return false;
    return new Date(interview.scheduled_at) <= new Date() || interview.status !== 'Scheduled';
  });

  if (candidatesLoading || interviewsLoading) {
    return (
      <div className="flex h-screen bg-gradient-subtle font-poppins">
        <AppSidebar userRole="job_seeker" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p>Loading your applications...</p>
          </div>
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
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-white/90 text-lg">
              Track your job applications and upcoming interviews
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Applications ({candidates.length})
              </TabsTrigger>
              <TabsTrigger value="interviews" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming Interviews ({upcomingInterviews.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Interview History ({pastInterviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Applications Tab */}
            <TabsContent value="applications">
              <div className="space-y-4">
                {candidates.length === 0 ? (
                  <Card className="bg-card shadow-card border-0">
                    <CardContent className="p-12 text-center">
                      <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start applying to jobs to see your applications here.
                      </p>
                      <Button>
                        Browse Jobs
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  candidates.map((application) => (
                    <Card key={application.id} className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-semibold">
                                {application.job_posting?.title || 'Job Title Not Available'}
                              </h3>
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                            
                            {application.job_posting && (
                              <div className="space-y-3 mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Building className="w-4 h-4" />
                                    <span>{application.job_posting.department}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{application.job_posting.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="w-4 h-4" />
                                    <span>{application.job_posting.job_type}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{formatSalary(application.job_posting.salary_min, application.job_posting.salary_max)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    Applied: {new Date(application.applied_at).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="w-4 h-4" />
                                    Match: {application.match_score}%
                                  </div>
                                </div>
                                
                                {application.job_posting.description && (
                                  <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-sm font-medium mb-1">Job Description:</p>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                      {application.job_posting.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {application.cover_letter && (
                              <div className="bg-muted rounded-lg p-3 mb-4">
                                <p className="text-sm font-medium mb-1">Your Cover Letter:</p>
                                <p className="text-sm text-muted-foreground">{application.cover_letter}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">
                            View Full Job Details
                          </Button>
                          {application.resume_url && (
                            <Button variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Resume
                            </Button>
                          )}
                          <Button 
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteApplication(application.id)}
                            disabled={deletingApplications.has(application.id)}
                          >
                            {deletingApplications.has(application.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Upcoming Interviews Tab */}
            <TabsContent value="interviews">
              <div className="space-y-4">
                {upcomingInterviews.length === 0 ? (
                  <Card className="bg-card shadow-card border-0">
                    <CardContent className="p-12 text-center">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Upcoming Interviews</h3>
                      <p className="text-muted-foreground">
                        When employers schedule interviews, they will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingInterviews.map((interview) => {
                    const { date, time } = formatDateTime(interview.scheduled_at!);
                    const relatedApplication = candidates.find(c => c.id === interview.candidate_id);
                    return (
                      <Card key={interview.id} className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                {getInterviewTypeIcon(interview.interview_type)}
                                <h3 className="text-xl font-semibold">{interview.interview_type}</h3>
                                <Badge className={getInterviewStatusColor(interview.status)}>
                                  {interview.status}
                                </Badge>
                                {interview.status === 'Scheduled' && (
                                  <div className="flex items-center gap-1 text-green-600 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Live
                                  </div>
                                )}
                              </div>
                              
                              {relatedApplication?.job_posting && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                  <p className="text-sm font-medium text-blue-900 mb-1">For Position:</p>
                                  <p className="text-blue-800 font-semibold">{relatedApplication.job_posting.title}</p>
                                  <p className="text-sm text-blue-700">
                                    {relatedApplication.job_posting.department} • {relatedApplication.job_posting.location}
                                  </p>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {date}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {time}
                                </div>
                              </div>
                              
                              {interview.meeting_link && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Video className="w-5 h-5 text-green-600" />
                                      <span className="text-sm font-medium text-green-800">
                                        Meeting Link Ready
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      asChild
                                    >
                                      <a 
                                        href={interview.meeting_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2"
                                      >
                                        Join Meeting
                                        <ArrowRight className="w-4 h-4" />
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {interview.notes && (
                                <div className="bg-muted rounded-lg p-3 mb-4">
                                  <p className="text-sm font-medium mb-1">Interview Notes:</p>
                                  <p className="text-sm text-muted-foreground">{interview.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-hero hover:opacity-90">
                              <Calendar className="w-4 h-4 mr-2" />
                              Add to Calendar
                            </Button>
                            {interview.meeting_link && (
                              <Button variant="outline" asChild>
                                <a 
                                  href={interview.meeting_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <Video className="w-4 h-4" />
                                  Join Meeting
                                  <ArrowRight className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Interview History Tab */}
            <TabsContent value="history">
              <div className="space-y-4">
                {pastInterviews.length === 0 ? (
                  <Card className="bg-card shadow-card border-0">
                    <CardContent className="p-12 text-center">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Interview History</h3>
                      <p className="text-muted-foreground">
                        Completed interviews will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  pastInterviews.map((interview) => {
                    const { date, time } = formatDateTime(interview.scheduled_at!);
                    const relatedApplication = candidates.find(c => c.id === interview.candidate_id);
                    return (
                      <Card key={interview.id} className="bg-card shadow-card border-0">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getInterviewTypeIcon(interview.interview_type)}
                                <h3 className="text-lg font-semibold">{interview.interview_type}</h3>
                                <Badge className={getInterviewStatusColor(interview.status)}>
                                  {interview.status}
                                </Badge>
                              </div>
                              
                              {relatedApplication?.job_posting && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  For: {relatedApplication.job_posting.title} at {relatedApplication.job_posting.department}
                                </p>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {date}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  {time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MyApplications;

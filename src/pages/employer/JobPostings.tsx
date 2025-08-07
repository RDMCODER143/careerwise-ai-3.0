import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Eye,
  Clock,
  Edit,
  Trash2,
  Users,
  MapPin,
  IndianRupee,
  Calendar,
  BarChart3
} from "lucide-react";
import { useJobPostings, JobPosting } from "@/hooks/useJobPostings";
import { useCandidates } from "@/hooks/useCandidates";
import { CreateJobDialog } from "@/components/CreateJobDialog";
import { EditJobDialog } from "@/components/EditJobDialog";
import { ScheduleInterviewDialog } from "@/components/ScheduleInterviewDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const JobPostings = () => {
  const { jobPostings, isLoading, deleteJobPosting } = useJobPostings();
  const { candidates } = useCandidates();
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [selectedJobForCandidates, setSelectedJobForCandidates] = useState<string | null>(null);
  const [schedulingInterview, setSchedulingInterview] = useState<{
    candidateId: string;
    jobPostingId: string;
    candidateName: string;
  } | null>(null);
  const [analyzingJobs, setAnalyzingJobs] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Calculate stats
  const activeJobs = jobPostings.filter(job => job.status === 'Active').length;
  const draftJobs = jobPostings.filter(job => job.status === 'Draft').length;
  const pausedJobs = jobPostings.filter(job => job.status === 'Paused').length;
  const totalApplications = candidates.length;

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `₹${(min/100000).toFixed(1)}L - ₹${(max/100000).toFixed(1)}L`;
    if (min) return `₹${(min/100000).toFixed(1)}L+`;
    if (max) return `Up to ₹${(max/100000).toFixed(1)}L`;
    return 'Not specified';
  };

  const getApplicationCount = (jobId: string) => {
    return candidates.filter(c => c.job_posting_id === jobId).length;
  };

  const getJobCandidates = (jobId: string) => {
    return candidates.filter(c => c.job_posting_id === jobId);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getExpiryTime = (expiryDate?: string) => {
    if (!expiryDate) return 'No expiry';
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 0) return 'Expired';
    return `${diffInDays} days left`;
  };

  const handleBulkAnalysis = async (job: JobPosting) => {
    setAnalyzingJobs(prev => new Set(prev).add(job.id));
    
    try {
      const webhookData = {
        job_posting_id: job.id,
        job_posting_title: job.title,
        title: job.title,
        department: job.department,
        location: job.location,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        job_type: job.job_type,
        status: job.status,
        description: job.description,
        requirements: job.requirements || [],
        benefits: job.benefits || [],
        expires_at: job.expires_at,
        created_at: job.created_at,
        candidates: getJobCandidates(job.id).map(candidate => ({
          id: candidate.id,
          full_name: candidate.full_name,
          email: candidate.email,
          status: candidate.status,
          match_score: candidate.match_score,
          applied_at: candidate.applied_at,
          skills: candidate.skills,
          experience_years: candidate.experience_years
        })),
        total_candidates: getJobCandidates(job.id).length,
        timestamp: new Date().toISOString()
      };

      console.log('Sending bulk analysis data:', webhookData);

      const response = await fetch('https://prakashgdg.app.n8n.cloud/webhook/20dccbac-63aa-4b2a-b94e-d4d6194f9a77', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(webhookData),
        mode: 'cors',
      });

      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.text();
      console.log('Webhook response:', responseData);

      toast({
        title: "Analysis Started",
        description: `Bulk analysis initiated for "${job.title}" (ID: ${job.id}). Processing ${getJobCandidates(job.id).length} candidates.`,
      });

    } catch (error) {
      console.error('Bulk analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: `Failed to start bulk analysis for "${job.title}". Please check your connection and try again.`,
        variant: "destructive",
      });
    } finally {
      setAnalyzingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <AppSidebar userRole="employer" />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Postings</h1>
              <p className="text-gray-600 mt-1">Manage your job listings and track applications</p>
            </div>
            <CreateJobDialog />
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Active Jobs</p>
                    <p className="text-xl font-bold text-blue-900">{activeJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Applications</p>
                    <p className="text-xl font-bold text-green-900">{totalApplications}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Draft Jobs</p>
                    <p className="text-xl font-bold text-yellow-900">{draftJobs}</p>
                  </div>
                  <Edit className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Paused Jobs</p>
                    <p className="text-xl font-bold text-purple-900">{pausedJobs}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">All Job Postings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">Loading job postings...</div>
              ) : jobPostings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No job postings yet</p>
                  <p className="text-sm">Create your first job posting to get started!</p>
                </div>
              ) : (
                jobPostings.map((job) => (
                  <div key={job.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <Badge 
                            variant={
                              job.status === 'Active' ? 'default' : 
                              job.status === 'Paused' ? 'secondary' : 'outline'
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{job.department} • {job.job_type}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4" />
                            {formatSalary(job.salary_min, job.salary_max)}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {getApplicationCount(job.id)} applications
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">{getTimeAgo(job.created_at)}</p>
                        <p className="text-xs text-gray-500">{getExpiryTime(job.expires_at)}</p>
                      </div>
                    </div>

                    {/* Show applications for this job if expanded */}
                    {selectedJobForCandidates === job.id && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-3">Recent Applications</h4>
                        <div className="space-y-2">
                          {getJobCandidates(job.id).slice(0, 3).map((candidate) => (
                            <div key={candidate.id} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{candidate.full_name}</p>
                                <p className="text-xs text-gray-500">{candidate.applied_at}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {candidate.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSchedulingInterview({
                                    candidateId: candidate.id,
                                    jobPostingId: job.id,
                                    candidateName: candidate.full_name
                                  })}
                                >
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Schedule
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setSelectedJobForCandidates(
                          selectedJobForCandidates === job.id ? null : job.id
                        )}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {selectedJobForCandidates === job.id ? 'Hide' : 'View'} Applications ({getApplicationCount(job.id)})
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleBulkAnalysis(job)}
                        disabled={analyzingJobs.has(job.id)}
                        className="min-w-[140px]"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {analyzingJobs.has(job.id) ? 'Analyzing...' : 'Bulk Analysis'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setEditingJob(job)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteJobPosting(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Job Dialog */}
      {editingJob && (
        <EditJobDialog
          job={editingJob}
          isOpen={!!editingJob}
          onClose={() => setEditingJob(null)}
        />
      )}

      {/* Schedule Interview Dialog */}
      {schedulingInterview && (
        <ScheduleInterviewDialog
          isOpen={!!schedulingInterview}
          onClose={() => setSchedulingInterview(null)}
          candidateId={schedulingInterview.candidateId}
          jobPostingId={schedulingInterview.jobPostingId}
          candidateName={schedulingInterview.candidateName}
        />
      )}
    </div>
  );
};

export default JobPostings;

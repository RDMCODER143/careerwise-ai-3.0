
import AppSidebar from "@/components/AppSidebar";
import ChatBot from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users,
  Mail,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react";
import { useJobPostings, JobPosting } from "@/hooks/useJobPostings";
import { useCandidates } from "@/hooks/useCandidates";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { CreateJobDialog } from "@/components/CreateJobDialog";
import { Edit, Trash2 } from "lucide-react";
import { EditJobDialog } from "@/components/EditJobDialog";

const EmployerDashboard = () => {
  const { user, isLoading: isLoadingUser } = useUser();
  const { jobPostings, isLoading: isLoadingJobs, deleteJobPosting } = useJobPostings();
  const { candidates, isLoading: isLoadingCandidates } = useCandidates();
  const [activeJobs, setActiveJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  useEffect(() => {
    if (jobPostings) {
      setActiveJobs(jobPostings.filter(job => job.status === 'Active').length);
    }
    if (candidates) {
      setTotalApplications(candidates.length);
    }
  }, [jobPostings, candidates]);

  const getApplicationCount = (jobId: string) => {
    return candidates.filter(c => c.job_posting_id === jobId).length;
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

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${(min/1000).toFixed(0)}k - $${(max/1000).toFixed(0)}k`;
    if (min) return `$${(min/1000).toFixed(0)}k+`;
    if (max) return `Up to $${(max/1000).toFixed(0)}k`;
    return 'Not specified';
  };

  if (isLoadingUser) {
    return <div>Loading user data...</div>;
  }

  if (!user || user.role !== 'employer') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <AppSidebar userRole="employer" />
      
      <div className="flex-1 overflow-auto">
        {/* Header with green theme */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white border-b border-green-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-green-100 mt-1">Welcome back, {user.full_name}! Here's a snapshot of your activity.</p>
        </div>

        <div className="p-6">
          {/* Stats Cards with green theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Active Jobs</p>
                    <p className="text-xl font-bold text-green-900">{activeJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-medium">Total Applications</p>
                    <p className="text-xl font-bold text-emerald-900">{totalApplications}</p>
                  </div>
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-600 text-sm font-medium">New Messages</p>
                    <p className="text-xl font-bold text-teal-900">16</p>
                  </div>
                  <Mail className="h-8 w-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-lime-50 to-lime-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lime-600 text-sm font-medium">Profile Views</p>
                    <p className="text-xl font-bold text-lime-900">244</p>
                  </div>
                  <Users className="h-8 w-8 text-lime-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Job Postings */}
            <Card className="lg:col-span-2 shadow-sm border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Recent Job Postings</CardTitle>
                  <CreateJobDialog />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingJobs ? (
                  <div className="text-center py-8">Loading job postings...</div>
                ) : jobPostings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No job postings yet</p>
                    <p className="text-sm">Create your first job posting to get started!</p>
                  </div>
                ) : (
                  jobPostings.slice(0, 5).map((job) => (
                    <div key={job.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md hover:border-green-200 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            <Badge 
                              variant={
                                job.status === 'Active' ? 'default' : 
                                job.status === 'Paused' ? 'secondary' : 'outline'
                              }
                              className={job.status === 'Active' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getApplicationCount(job.id)} applications • {getTimeAgo(job.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-green-50 hover:text-green-700"
                            onClick={() => setEditingJob(job)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteJobPosting(job.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingCandidates ? (
                  <div className="text-center py-8">Loading applications...</div>
                ) : candidates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No applications yet</p>
                    <p className="text-sm">Check back later for new submissions!</p>
                  </div>
                ) : (
                  candidates.slice(0, 5).map((candidate) => (
                    <div key={candidate.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md hover:border-green-200 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{candidate.full_name}</h3>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied for {candidate.job_posting_id} • {getTimeAgo(candidate.applied_at)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">{candidate.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
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

      <ChatBot />
    </div>
  );
};

export default EmployerDashboard;

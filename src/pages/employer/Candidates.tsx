import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCandidates } from "@/hooks/useCandidates";
import { useJobPostings } from "@/hooks/useJobPostings";
import { exportCandidatesToCSV } from "@/utils/csvExport";

const Candidates = () => {
  const { candidates, isLoading, updateCandidateStatus } = useCandidates();
  const { jobPostings } = useJobPostings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Phone Screen': return 'bg-purple-100 text-purple-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'New Application': return 'bg-green-100 text-green-800';
      case 'Hired': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobPostings.find(j => j.id === jobId);
    return job?.title || 'Unknown Position';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const handleExportCSV = () => {
    exportCandidatesToCSV(candidates, jobPostings);
  };

  // Calculate stats
  const interviewReady = candidates.filter(c => c.status === 'Interview Scheduled' || c.status === 'Phone Screen').length;
  const underReview = candidates.filter(c => c.status === 'Under Review').length;
  const newApplications = candidates.filter(c => c.status === 'New Application').length;

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <AppSidebar userRole="employer" />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
              <p className="text-gray-600 mt-1">Review and manage job applications</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search candidates by name, position, or skills..." 
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Candidates</p>
                    <p className="text-xl font-bold text-blue-900">{candidates.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Interview Ready</p>
                    <p className="text-xl font-bold text-green-900">{interviewReady}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Under Review</p>
                    <p className="text-xl font-bold text-yellow-900">{underReview}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">New Applications</p>
                    <p className="text-xl font-bold text-purple-900">{newApplications}</p>
                  </div>
                  <Mail className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Candidates List */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">All Candidates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">Loading candidates...</div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No candidates yet</p>
                  <p className="text-sm">Applications will appear here once job seekers start applying!</p>
                </div>
              ) : (
                candidates.map((candidate) => (
                  <div key={candidate.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {candidate.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{candidate.full_name}</h3>
                            <p className="text-gray-600">{getJobTitle(candidate.job_posting_id)}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{candidate.match_score}% match</span>
                            </div>
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {candidate.location || 'Location not specified'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {candidate.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {candidate.phone || 'Phone not provided'}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Experience: {candidate.experience_years ? `${candidate.experience_years} years` : 'Not specified'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills?.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            )) || <span className="text-sm text-gray-500">No skills listed</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Applied {getTimeAgo(candidate.applied_at)}</p>
                          <div className="flex gap-2">
                            {candidate.resume_url && (
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Resume
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateCandidateStatus({ id: candidate.id, status: 'Interview Scheduled' })}
                            >
                              Schedule Interview
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Candidates;

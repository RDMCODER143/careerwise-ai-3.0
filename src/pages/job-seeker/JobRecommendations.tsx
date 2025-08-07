
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee,
  Filter,
  Search,
  Bookmark,
  ExternalLink,
  Star,
  Building,
  Loader2,
  CheckCircle
} from "lucide-react";
import { useJobRecommendations } from '@/hooks/useJobRecommendations';
import { useCandidates } from '@/hooks/useCandidates';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const JobRecommendations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const { jobRecommendations, isLoading, error } = useJobRecommendations();
  const { candidates, createApplication, isCreatingApplication } = useCandidates();
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleApply = (jobId: string, jobTitle: string) => {
    if (!profile) {
      toast({ title: 'Error', description: 'Please log in to apply for jobs', variant: 'destructive' });
      return;
    }

    createApplication({
      job_posting_id: jobId,
      full_name: profile.full_name || "Unknown",
      email: profile.user_id, // Using user_id as email placeholder
      status: 'New Application',
      match_score: Math.floor(Math.random() * 20) + 80,
    });
  };

  // Check if user has already applied to a job
  const hasApplied = (jobId: string) => {
    return candidates.some(candidate => candidate.job_posting_id === jobId);
  };

  const getMatchScore = () => Math.floor(Math.random() * 20) + 80;
  
  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-500";
    if (match >= 80) return "bg-blue-500";
    return "bg-gray-500";
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `₹${(min/100000).toFixed(1)}L - ₹${(max/100000).toFixed(1)}L`;
    if (min) return `₹${(min/100000).toFixed(1)}L+`;
    if (max) return `Up to ₹${(max/100000).toFixed(1)}L`;
  };

  const filteredJobs = jobRecommendations.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || 
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesJobType = jobTypeFilter === "all" || 
      job.job_type.toLowerCase().replace("-", "").includes(jobTypeFilter);
    
    return matchesSearch && matchesLocation && matchesJobType;
  });

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

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-subtle font-poppins">
        <AppSidebar userRole="job_seeker" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error loading job recommendations</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
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
            <h1 className="text-3xl font-bold mb-2">Job Recommendations</h1>
            <p className="text-white/90 text-lg">
              Personalized job matches based on your skills and preferences
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Search and Filters */}
          <Card className="bg-card shadow-card border-0 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search jobs by title, company, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const matchScore = getMatchScore();
              const alreadyApplied = hasApplied(job.id);
              
              return (
                <Card key={job.id} className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <div className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getMatchColor(matchScore)}`}>
                            {matchScore}% Match
                          </div>
                          {alreadyApplied && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Applied
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline">{job.job_type}</Badge>
                          <div className="flex items-center gap-1 text-green-600">
                            <IndianRupee className="w-4 h-4" />
                            <span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                          {job.description || "No description available"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements?.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-border">
                      {alreadyApplied ? (
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Already Applied
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1 bg-gradient-hero hover:opacity-90"
                          onClick={() => handleApply(job.id, job.title)}
                          disabled={isCreatingApplication}
                        >
                          {isCreatingApplication ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <ExternalLink className="w-4 h-4 mr-2" />
                          )}
                          Apply Now
                        </Button>
                      )}
                      <Button variant="outline">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="outline">
                        <Star className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="bg-card shadow-card border-0">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                <p className="text-muted-foreground">
                  No jobs match your current search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobRecommendations;

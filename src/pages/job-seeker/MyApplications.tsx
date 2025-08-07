
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Building,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download
} from "lucide-react";

const MyApplications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock applications data
  const applications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      appliedDate: "2024-08-05",
      status: "Interview Scheduled",
      statusColor: "bg-blue-500",
      salary: "₹15-25 LPA",
      type: "Full-time"
    },
    {
      id: 2,
      jobTitle: "React Developer",
      company: "StartupXYZ",
      location: "Mumbai, India",
      appliedDate: "2024-08-03",
      status: "Under Review",
      statusColor: "bg-yellow-500",
      salary: "₹12-18 LPA",
      type: "Full-time"
    },
    {
      id: 3,
      jobTitle: "Full Stack Developer",
      company: "Digital Solutions Inc",
      location: "Remote",
      appliedDate: "2024-08-01",
      status: "Rejected",
      statusColor: "bg-red-500",
      salary: "₹18-28 LPA",
      type: "Contract"
    },
    {
      id: 4,
      jobTitle: "UI/UX Developer",
      company: "Creative Agency",
      location: "Delhi, India",
      appliedDate: "2024-07-30",
      status: "Accepted",
      statusColor: "bg-green-500",
      salary: "₹10-15 LPA",
      type: "Full-time"
    },
    {
      id: 5,
      jobTitle: "JavaScript Developer",
      company: "Web Solutions Ltd",
      location: "Pune, India",
      appliedDate: "2024-07-28",
      status: "Applied",
      statusColor: "bg-gray-500",
      salary: "₹8-12 LPA",
      type: "Part-time"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Interview Scheduled":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "Under Review":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === "" || 
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      app.status.toLowerCase().replace(" ", "").includes(statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  const applicationStats = [
    { label: "Total Applications", value: applications.length, color: "bg-red-800" },
    { label: "Under Review", value: applications.filter(app => app.status === "Under Review").length, color: "bg-yellow-500" },
    { label: "Interview Scheduled", value: applications.filter(app => app.status === "Interview Scheduled").length, color: "bg-blue-500" },
    { label: "Accepted", value: applications.filter(app => app.status === "Accepted").length, color: "bg-green-500" }
  ];

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="job_seeker" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-red-800 to-red-900 text-white p-6 shadow-elegant">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-white/90 text-lg">
              Track and manage all your job applications in one place
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Application Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {applicationStats.map((stat, index) => (
              <Card key={index} className="bg-card shadow-card border-0">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <span className="text-white font-bold text-xl">{stat.value}</span>
                  </div>
                  <p className="text-sm font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search and Filters */}
          <Card className="bg-card shadow-card border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search applications by job title or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="underreview">Under Review</SelectItem>
                      <SelectItem value="interviewscheduled">Interview</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="bg-card shadow-card border-0 hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{application.jobTitle}</h3>
                        <Badge className={`${application.statusColor} text-white`}>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {application.company}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {application.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied: {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="outline" className="border-red-800 text-red-800">{application.type}</Badge>
                        <span className="text-green-600 font-medium">{application.salary}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button size="sm" className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-800 text-red-800 hover:bg-red-800 hover:text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {application.status === "Interview Scheduled" && (
                      <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        View Interview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <Card className="bg-card shadow-card border-0">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                <p className="text-muted-foreground">
                  No applications match your current search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyApplications;

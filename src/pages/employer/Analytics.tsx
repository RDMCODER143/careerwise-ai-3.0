
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar,
  Eye,
  Clock,
  Target,
  Award
} from "lucide-react";

const Analytics = () => {
  const applicationData = [
    { month: 'Jan', applications: 45, hires: 3 },
    { month: 'Feb', applications: 52, hires: 4 },
    { month: 'Mar', applications: 38, hires: 2 },
    { month: 'Apr', applications: 61, hires: 5 },
    { month: 'May', applications: 55, hires: 4 },
    { month: 'Jun', applications: 67, hires: 6 }
  ];

  const jobPerformanceData = [
    { name: 'Frontend Developer', applications: 85, views: 420 },
    { name: 'Product Manager', applications: 62, views: 310 },
    { name: 'UX Designer', applications: 45, views: 280 },
    { name: 'Backend Developer', applications: 38, views: 240 }
  ];

  const sourceData = [
    { name: 'Company Website', value: 35, color: '#3B82F6' },
    { name: 'LinkedIn', value: 28, color: '#8B5CF6' },
    { name: 'Indeed', value: 20, color: '#10B981' },
    { name: 'Glassdoor', value: 12, color: '#F59E0B' },
    { name: 'Referral', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <AppSidebar userRole="employer" />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your hiring performance and metrics</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Applications</p>
                    <p className="text-2xl font-bold text-blue-900">318</p>
                    <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Successful Hires</p>
                    <p className="text-2xl font-bold text-green-900">24</p>
                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                  </div>
                  <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Avg. Time to Hire</p>
                    <p className="text-2xl font-bold text-purple-900">18 days</p>
                    <p className="text-xs text-purple-600 mt-1">-2 days from last month</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Job Views</p>
                    <p className="text-2xl font-bold text-orange-900">1,250</p>
                    <p className="text-xs text-orange-600 mt-1">+25% from last month</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications & Hires Trend */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Applications & Hires Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="hires" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Application Sources */}
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Application Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Job Performance */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={jobPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8B5CF6" name="Views" />
                  <Bar dataKey="applications" fill="#3B82F6" name="Applications" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hiring Funnel */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Hiring Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">318</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-gray-600">Screened</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">78</div>
                  <div className="text-sm text-gray-600">Interviewed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">32</div>
                  <div className="text-sm text-gray-600">Final Round</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">24</div>
                  <div className="text-sm text-gray-600">Hired</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

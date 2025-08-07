
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Shield, Users, Building2 } from "lucide-react";

export default function AdminDashboard() {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("job_seekers");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!profile || (profile.role !== 'admin' && profile.app_role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-red-50">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-red-600" />
                <h1 className="text-3xl font-bold text-red-900">Admin Dashboard</h1>
              </div>
              <p className="text-red-700">Manage users and system settings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-red-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">2,345</div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Job Seekers</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">1,875</div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Employers</CardTitle>
                  <Building2 className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">470</div>
                </CardContent>
              </Card>
            </div>

            {/* Users Management */}
            <Card className="border-red-200 bg-white">
              <CardHeader>
                <CardTitle className="text-red-900">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-red-100 border-red-200">
                    <TabsTrigger 
                      value="job_seekers" 
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                    >
                      Job Seekers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="employers"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                    >
                      Employers
                    </TabsTrigger>
                    <TabsTrigger 
                      value="all"
                      className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
                    >
                      All Users
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="job_seekers" className="mt-6">
                    <AdminUsersTable userType="job_seeker" />
                  </TabsContent>
                  
                  <TabsContent value="employers" className="mt-6">
                    <AdminUsersTable userType="employer" />
                  </TabsContent>
                  
                  <TabsContent value="all" className="mt-6">
                    <AdminUsersTable userType="all" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

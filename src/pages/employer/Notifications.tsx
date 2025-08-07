
import React from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BriefcaseIcon, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare
} from "lucide-react";

const Notifications = () => {
  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: "application",
      title: "New Job Application",
      message: "John Doe applied for Frontend Developer position",
      time: "2 minutes ago",
      unread: true,
      priority: "high"
    },
    {
      id: 2,
      type: "interview",
      title: "Interview Scheduled",
      message: "Interview scheduled with Sarah Johnson for tomorrow at 2 PM",
      time: "1 hour ago",
      unread: true,
      priority: "medium"
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      message: "Candidate sent a follow-up message regarding Backend Developer role",
      time: "3 hours ago",
      unread: false,
      priority: "low"
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "application": return <BriefcaseIcon className="w-5 h-5" />;
      case "interview": return <Users className="w-5 h-5" />;
      case "message": return <MessageSquare className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-subtle font-poppins">
      <AppSidebar userRole="employer" />
      
      <main className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-green-100 text-lg">
              Stay updated with all your recruitment activities
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Notifications</h2>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={`bg-card shadow-card border-0 hover:shadow-lg hover:border-green-200 transition-all duration-300 ${notification.unread ? 'border-l-4 border-l-green-600' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${getPriorityColor(notification.priority)} text-white`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{notification.title}</h3>
                        <p className="text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {notification.time}
                          </div>
                          <Badge variant={notification.priority === "high" ? "destructive" : "secondary"}>
                            {notification.priority} priority
                          </Badge>
                          {notification.unread && (
                            <Badge className="bg-green-600 text-white hover:bg-green-700">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-green-50">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;

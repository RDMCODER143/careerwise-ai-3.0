
import { Shield, Users, Settings, LogOut, Home, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin-dashboard" },
    { icon: Users, label: "User Management", path: "/admin-dashboard" },
    { icon: BarChart3, label: "Analytics", path: "/admin-analytics" },
    { icon: Settings, label: "Settings", path: "/admin-settings" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-red-900 text-white p-6">
      {/* Logo/Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8" />
        <div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-red-200 text-sm">System Control</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 ${
                isActive 
                  ? "bg-red-800 text-white hover:bg-red-700" 
                  : "text-red-100 hover:bg-red-800 hover:text-white"
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-100 hover:bg-red-800 hover:text-white"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}

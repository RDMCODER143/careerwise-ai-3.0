
import {
  Home,
  Briefcase,
  Settings,
  LogOut,
  GraduationCap,
  Menu,
  X,
  User,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

interface AppSidebarProps {
  userRole?: "job_seeker" | "employer";
  userType?: "job_seeker" | "employer"; // Support both prop names for compatibility
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function AppSidebar({ userRole, userType, activeSection, onSectionChange }: AppSidebarProps) {
  // Use userRole if provided, otherwise fallback to userType for compatibility
  const role = userRole || userType;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { signOut, firstName, lastName, profile } = useAuth();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Job seeker specific navigation
  const jobSeekerItems = [
    { name: "Dashboard", href: "/job-seeker-dashboard", icon: Home },
    { name: "Resume Analyzer", href: "/resume-analyzer", icon: GraduationCap },
    { name: "Career Counseling", href: "/career-counseling", icon: User },
    { name: "Job Recommendations", href: "/job-recommendations", icon: Briefcase },
    { name: "Skill Gap Analyzer", href: "/skill-gap", icon: Settings },
    { name: "Mock Interviews", href: "/mock-interviews", icon: Bell },
    { name: "My Applications", href: "/my-applications", icon: GraduationCap },
    { name: "Profile Settings", href: "/profile-settings", icon: User },
  ];

  // Employer specific navigation
  const employerItems = [
    { name: "Dashboard", href: "/employer-dashboard", icon: Home },
    { name: "Job Postings", href: "/job-postings", icon: Briefcase },
    { name: "Candidates", href: "/candidates", icon: User },
    { name: "Analytics", href: "/analytics", icon: Settings },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const navigationItems = role === "job_seeker" ? jobSeekerItems : employerItems;

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Display name logic - use first and last name if available, otherwise fallback
  const displayName = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : (firstName || profile?.full_name || 'User');

  const displayFirstName = firstName || profile?.full_name?.split(' ')[0] || 'User';

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 md:hidden"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isMobile ? 'z-50' : 'z-10'}
          transition-transform duration-300 ease-in-out
          bg-white border-r border-gray-200 
          ${isMobile ? 'w-72' : 'w-64'}
          h-screen flex flex-col
          font-poppins
        `}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">CareerWise</h1>
              <p className="text-xs text-gray-500 capitalize">
                {role?.replace('_', ' ') || 'User'} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-gray-50">
          <h2 className="text-sm font-medium text-gray-900">
            Welcome back, {displayFirstName}!
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            {role === "job_seeker" 
              ? "Find your dream career opportunity" 
              : "Manage your hiring pipeline"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                    ${isActive 
                      ? "bg-white/20" 
                      : "bg-gray-100 group-hover:bg-primary/10 group-hover:scale-110"
                    }
                  `}>
                    <item.icon className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-gray-600 group-hover:text-primary"
                    }`} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              {profile?.profile_photo_url ? (
                <img 
                  src={profile.profile_photo_url} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {displayFirstName.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 capitalize">
                {role?.replace('_', ' ') || 'User'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 group-hover:bg-red-200 transition-all duration-200">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

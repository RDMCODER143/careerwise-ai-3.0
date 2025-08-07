import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "job_seeker" | "employer";

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  className?: string;
}

export function RoleSelector({ selectedRole, onRoleSelect, className }: RoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Who are you?</h2>
        <p className="text-muted-foreground">Choose your role to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 group",
            "hover:shadow-lg hover:scale-105",
            selectedRole === "job_seeker" 
              ? "ring-2 ring-primary bg-primary/5" 
              : "hover:ring-1 hover:ring-primary/50"
          )}
          onClick={() => onRoleSelect("job_seeker")}
          onMouseEnter={() => setHoveredRole("job_seeker")}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
              "bg-gradient-to-br from-blue-50 to-green-50",
              selectedRole === "job_seeker" || hoveredRole === "job_seeker"
                ? "from-primary/20 to-primary-glow/20"
                : ""
            )}>
              <GraduationCap className={cn(
                "w-8 h-8 transition-colors",
                selectedRole === "job_seeker" || hoveredRole === "job_seeker"
                  ? "text-primary"
                  : "text-primary/70"
              )} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Job Seeker / Student</h3>
              <p className="text-sm text-muted-foreground">
                Find matched jobs, get resume feedback & career guidance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-300 group",
            "hover:shadow-lg hover:scale-105",
            selectedRole === "employer" 
              ? "ring-2 ring-primary bg-primary/5" 
              : "hover:ring-1 hover:ring-primary/50"
          )}
          onClick={() => onRoleSelect("employer")}
          onMouseEnter={() => setHoveredRole("employer")}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <CardContent className="p-6 text-center space-y-4">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors",
              "bg-gradient-to-br from-blue-50 to-green-50",
              selectedRole === "employer" || hoveredRole === "employer"
                ? "from-primary/20 to-primary-glow/20"
                : ""
            )}>
              <Building2 className={cn(
                "w-8 h-8 transition-colors",
                selectedRole === "employer" || hoveredRole === "employer"
                  ? "text-primary"
                  : "text-primary/70"
              )} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Employer / Recruiter</h3>
              <p className="text-sm text-muted-foreground">
                Post jobs, screen resumes, and find ideal candidates with AI
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
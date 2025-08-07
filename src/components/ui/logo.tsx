import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="p-1.5 bg-gradient-to-br from-primary to-primary-glow rounded-lg">
        <Brain className={cn("text-primary-foreground", iconSizes[size])} />
      </div>
      <span className={cn("font-bold text-foreground", sizeClasses[size])}>
        CareerWise
      </span>
    </div>
  );
}
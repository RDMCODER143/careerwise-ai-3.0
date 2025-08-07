import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Lock, User, Building, GraduationCap, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type UserRole = "job_seeker" | "employer";

interface AuthFormProps {
  selectedRole: UserRole | null;
  onSuccess?: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function AuthForm({ selectedRole, onSuccess }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInWithLinkedIn, profile } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      companyName: "",
    },
  });

  const handleAuthSuccess = () => {
    // Wait a moment for profile to be loaded, then redirect based on role
    setTimeout(() => {
      if (profile?.role === "admin" || profile?.app_role === "admin") {
        navigate("/admin", { replace: true });
      } else if (selectedRole === "job_seeker" || profile?.role === "job_seeker") {
        navigate("/job-seeker-dashboard", { replace: true });
      } else if (selectedRole === "employer" || profile?.role === "employer") {
        navigate("/employer-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      onSuccess?.();
    }, 100);
  };

  const onLogin = async (data: LoginForm) => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error(error.message || "Failed to sign in");
      } else {
        toast.success("Signed in successfully!");
        handleAuthSuccess();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(
        data.email,
        data.password,
        data.fullName,
        selectedRole,
        data.companyName
      );
      
      if (error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully! Check your email to verify your account.");
        handleAuthSuccess();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "linkedin") => {
    if (!selectedRole) {
      toast.error("Please select your role first");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = provider === "google" 
        ? await signInWithGoogle() 
        : await signInWithLinkedIn();
      
      if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}`);
      } else {
        handleAuthSuccess();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleText = () => {
    return selectedRole === "job_seeker" ? "Job Seeker" : "Employer";
  };

  const getButtonText = () => {
    const roleText = getRoleText();
    return activeTab === "login" 
      ? `Sign in as ${roleText}`
      : `Create ${roleText} Account`;
  };

  if (!selectedRole) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg font-poppins">Almost There!</h3>
            <p className="text-muted-foreground font-poppins">Please select your role to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mb-4">
            {selectedRole === "job_seeker" ? (
              <GraduationCap className="w-6 h-6 text-white" />
            ) : (
              <Building className="w-6 h-6 text-white" />
            )}
          </div>
          <h2 className="text-xl font-bold font-poppins">Welcome to CareerWise</h2>
          <p className="text-muted-foreground font-poppins">
            Continue as <span className="font-medium text-primary">{getRoleText()}</span>
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span className="font-poppins">Your data is secure and encrypted</span>
        </div>

        {/* Tabs and Forms */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="font-poppins">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="font-poppins">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="email" placeholder="your@email.com" className="pl-10 font-poppins" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="password" placeholder="••••••••" className="pl-10 font-poppins" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 font-poppins" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} placeholder="John Doe" className="pl-10 font-poppins" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedRole === "employer" && (
                  <FormField
                    control={registerForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-poppins">Company Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Acme Corp" className="pl-10 font-poppins" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="email" placeholder="your@email.com" className="pl-10 font-poppins" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="password" placeholder="••••••••" className="pl-10 font-poppins" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input {...field} type="password" placeholder="••••••••" className="pl-10 font-poppins" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 font-poppins" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {getButtonText()}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        {/* Social Login */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/60 px-2 text-muted-foreground font-poppins">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading}
              className="w-full font-poppins bg-white/40 hover:bg-white/60"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSocialLogin("linkedin")}
              disabled={isLoading}
              className="w-full font-poppins bg-white/40 hover:bg-white/60"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Button>
          </div>
        </div>

        {activeTab === "login" && (
          <div className="text-center">
            <Button variant="link" className="text-sm text-muted-foreground font-poppins">
              Forgot your password?
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

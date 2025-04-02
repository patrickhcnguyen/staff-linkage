
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Shared/components/ui/form";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { toast } from "sonner";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Shared/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/Shared/components/ui/alert";
import { supabase } from "@/lib/supabase";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword } = useAuth();

  // Check for verification success in URL parameters
  useEffect(() => {
    // Process the URL for auth actions
    const handleAuthRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Confirmation success can be detected by type=signup in the URL
      if (hashParams.get('type') === 'signup' || queryParams.get('type') === 'signup') {
        setVerificationSuccess(true);
        // Clean up the URL to avoid confusion on refresh
        window.history.replaceState({}, document.title, '/login');
      }
    };
    
    handleAuthRedirect();
  }, [location]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      setIsSubmitting(true);
      setEmailNotVerified(false);
      
      // Sign in with Supabase
      const { data: signInData, error } = await signIn(values.email, values.password);
      
      if (error) {
        // Check if this is an email verification error
        if (error.message.includes("Email not confirmed")) {
          setEmailNotVerified(true);
          setUnverifiedEmail(values.email);
          toast.error("Please verify your email before signing in.");
          return;
        }
        throw error;
      }
      
      // Check user role to determine redirection
      if (signInData.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, first_name, last_name')
          .eq('id', signInData.user.id)
          .single();
          
        if (profileData?.role === 'company') {
          // Check if company has completed onboarding
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', signInData.user.id)
            .single();
          
          if (companyError && companyError.code !== 'PGRST116') {
            console.error("Error checking company onboarding status:", companyError);
          }
          
          if (!companyData) {
            // Company hasn't completed onboarding
            toast.success("Signed in successfully! Please complete your company profile.");
            navigate("/company-onboarding");
            return;
          }
          
          // Company has completed onboarding
          toast.success("Signed in successfully!");
          navigate("/company-dashboard");
          return;
        } else {
          // Handle staff user
          // Check if staff has completed onboarding (has name filled in)
          if (!profileData.first_name || !profileData.last_name) {
            toast.success("Signed in successfully! Please complete your profile.");
            navigate("/staff-onboarding");
            return;
          }
        }
      }
      
      // Default redirection
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
      // Pre-fill the reset email field with the attempted email
      setResetEmail(values.email);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsResetting(true);
      
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        throw error;
      }
      
      toast.success("Password reset link sent to your email!");
      setIsResetModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResendingVerification(true);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unverifiedEmail,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Verification email resent. Please check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend verification email. Please try again.");
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Sign In</h1>
        <p className="text-muted-foreground">
          Welcome back! Sign in to your account
        </p>
      </div>

      {verificationSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Email Verified Successfully</AlertTitle>
          <AlertDescription className="text-green-600">
            Your email has been verified. You can now sign in to your account.
          </AlertDescription>
        </Alert>
      )}

      {emailNotVerified && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Email not verified</AlertTitle>
          <AlertDescription>
            Please check your inbox and verify your email before signing in.
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleResendVerification}
                disabled={isResendingVerification}
              >
                {isResendingVerification ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend verification email"
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => setIsResetModalOpen(true)}
            >
              Forgot password?
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button variant="link" onClick={() => navigate("/signup")} className="p-0">
            Sign Up
          </Button>
        </p>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <FormItem className="text-left">
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
              />
            </FormItem>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResetModalOpen(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetPassword}
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignIn;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/Shared/components/ui/button";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const createProfileAndRedirect = async (currentUser: any) => {
    // Get the pending profile data
    const pendingProfile = localStorage.getItem('pendingProfile');
    if (!pendingProfile) {
      toast.error("Profile data not found. Please try signing up again.");
      navigate('/signup');
      return;
    }

    const profileData = JSON.parse(pendingProfile);

    // Create the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: currentUser.id,
        email: profileData.email,
        phone: profileData.phone,
        is_onboarded: false
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      toast.error("Failed to create profile. Please try again.");
      return;
    }

    localStorage.removeItem('pendingProfile');

    const role = profileData.role;
    navigate(role === 'company' ? '/company-onboarding' : '/staff-onboarding');
  };

  const checkVerification = async () => {
    setIsChecking(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser?.email_confirmed_at) {
        setIsVerified(true);
        await createProfileAndRedirect(currentUser);
      } else {
        setIsVerified(false);
        toast.error("Email not yet verified. Please check your inbox.");
      }
    } catch (error) {
      console.error("Verification check error:", error);
      toast.error("Failed to check verification status.");
    } finally {
      setIsChecking(false);
    }
  };

  const resendVerification = async () => {
    if (resendCooldown > 0) return;

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user?.email,
    });

    if (error) {
      toast.error("Failed to resend verification email.");
    } else {
      toast.success("Verification email resent!");
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((current) => {
          if (current <= 1) {
            clearInterval(timer);
            return 0;
          }
          return current - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    // Get email from pendingProfile
    const pendingProfile = localStorage.getItem('pendingProfile');
    if (pendingProfile) {
      const { email } = JSON.parse(pendingProfile);
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const pendingProfile = localStorage.getItem('pendingProfile');
    
    if (!user && !pendingProfile) {
      navigate('/login');
      return;
    }
    
    if (user) {
      checkVerification();
    }
  }, [user, navigate]);

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground">
          We've sent a verification link to <span className="font-medium">{userEmail || user?.email}</span>.
          Please check your email and verify your account to continue.
        </p>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={checkVerification}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking verification status...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check verification status
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={resendVerification}
            disabled={resendCooldown > 0}
          >
            {resendCooldown > 0 
              ? `Resend email in ${resendCooldown}s`
              : "Resend verification email"
            }
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or try resending the verification email.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
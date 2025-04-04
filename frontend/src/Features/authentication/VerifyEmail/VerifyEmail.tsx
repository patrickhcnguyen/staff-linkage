import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/Shared/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();

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
    // get email from pendingProfile
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
  }, [user, navigate]);

  useEffect(() => {
    // listen for verification 
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'emailVerified' && e.newValue === 'true') {
        setIsVerified(true);
        toast.success("Email verified successfully!");
      }
    };

    if (localStorage.getItem('emailVerified') === 'true') {
      setIsVerified(true);
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        {isVerified ? (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-muted-foreground">
              Your email has been verified successfully. You can now proceed with setting up your profile.
            </p>
          </>
        ) : (
          <>
            <Mail className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-muted-foreground">
              We've sent a verification link to <span className="font-medium">{userEmail || user?.email}</span>.
              Please check your email and verify your account to continue.
            </p>

            <div className="space-y-4">

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
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
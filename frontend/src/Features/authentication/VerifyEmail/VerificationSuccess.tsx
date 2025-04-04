import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle } from "lucide-react";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleVerificationSuccess = async () => {
        
        // close other tabs via local storage NOT WORKING
        localStorage.setItem('emailVerified', 'true');

        const pendingProfile = localStorage.getItem('pendingProfile');
        if (pendingProfile) {
            const { role } = JSON.parse(pendingProfile);
            setTimeout(() => {
            navigate(role === 'company' ? '/company-onboarding' : '/staff-onboarding');
            }, 2000);
        }
    };

    handleVerificationSuccess();
  }, [navigate]);

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="text-2xl font-bold">Email Verified Successfully!</h1>
        <p className="text-muted-foreground">
          Redirecting you to complete your profile...
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccess;
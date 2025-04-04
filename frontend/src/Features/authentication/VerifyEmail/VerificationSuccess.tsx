import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleVerificationSuccess = async () => {
      try {
        
        // check for email verification 
        localStorage.setItem('emailVerified', 'true');
        
        const pendingProfile = localStorage.getItem('pendingProfile');
        console.log("Pending profile data:", pendingProfile);

        if (!pendingProfile) {
          toast.error("Profile data not found");
          return;
        }

        const profileData = JSON.parse(pendingProfile);
        console.log("Parsed profile data:", profileData);

        // Handle different roles
        if (profileData.role === 'staff') {
          // Check if staff profile exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!existingProfile) {
            // Create staff profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                user_id: user.id,
                email: profileData.email,
                phone: profileData.phone,
                is_onboarded: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (profileError) {
              console.error("Error creating staff profile:", profileError);
              toast.error("Failed to create profile");
              return;
            }
          }
          
          navigate('/staff-onboarding');
        } 
        else if (profileData.role === 'company') {
          // Check if company exists
          const { data: existingCompany } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!existingCompany) {
            // Create initial company record
            const { error: companyError } = await supabase
              .from('companies')
              .insert({
                user_id: user.id,
                email: profileData.email,
                phone: profileData.phone,
                is_onboarded: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (companyError) {
              console.error("Error creating company:", companyError);
              toast.error("Failed to create company profile");
              return;
            }
          }

          navigate('/company-onboarding');
        }

        console.log("Profile/Company created successfully");
        toast.success("Account created! Redirecting to onboarding...");
        localStorage.removeItem('pendingProfile');
        
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingProfile) {
          console.log("Profile already exists, skipping creation");
          navigate(profileData.role === 'company' ? '/company-onboarding' : '/staff-onboarding');
          return;
        }

        // Create initial profile
        console.log("Creating profile for user:", user.id);
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: profileData.email,
            phone: profileData.phone,
            is_onboarded: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Failed to create profile");
          return;
        }

        console.log("Profile created successfully:", newProfile);
        toast.success("Profile created! Redirecting to onboarding...");

        // Clear pending profile data
        localStorage.removeItem('pendingProfile');

        // Redirect to onboarding
        navigate(profileData.role === 'company' ? '/company-onboarding' : '/staff-onboarding');
        
      } catch (error) {
        console.error("Error in verification success:", error);
        toast.error("Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    };

    handleVerificationSuccess();
  }, [navigate, user]); // Will re-run when user becomes available

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="text-2xl font-bold">Email Verified Successfully!</h1>
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-muted-foreground">Setting up your profile...</p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Redirecting you to complete your profile...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerificationSuccess;
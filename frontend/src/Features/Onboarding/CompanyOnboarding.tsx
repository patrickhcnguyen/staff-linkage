import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/Shared/components/ui/progress";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BasicInfoStep from "./companySteps/BasicInfoStep";
import LocationStep from "./companySteps/LocationStep";
import { SocialMediaStep } from "./companySteps/SocialMediatStep";
import { useCompanyOnboardingForm } from "./useCompanyOnboarding"
import { supabase } from "@/lib/supabase";

const CompanyOnboarding = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    basicInfoForm,
    socialMediaForm,
    // Add other form hooks here as you create more steps
  } = useCompanyOnboardingForm();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to continue with company onboarding"
      });
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async () => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to continue"
      });
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const basicInfo = basicInfoForm.getValues();
      const socialMedia = socialMediaForm.getValues();
      
      // Upload logo to Supabase Storage if available
      let logoUrl = "/placeholder.svg";
      if (basicInfo.companyPhoto && basicInfo.companyPhoto[0]) {
        logoUrl = await uploadLogo(basicInfo.companyPhoto[0]);
        if (!logoUrl) {
          toast("Warning", {
            description: "Could not upload logo, using default image"
          });
          logoUrl = "/placeholder.svg";
        }
      }
      
      // Create company profile in Supabase
      const { error } = await supabase
        .from('companies')
        .insert([{
          user_id: user.id,
          name: basicInfo.name,
          type: basicInfo.type,
          email: basicInfo.email,
          phone: basicInfo.phone,
          description: basicInfo.description,
          street: basicInfo.street,
          city: basicInfo.city,
          state: basicInfo.state,
          zip_code: basicInfo.zipCode,
          founded: basicInfo.founded,
          number_of_employees: basicInfo.numberOfEmployees,
          logo_url: logoUrl,
          website: basicInfo.website,
          facebook: socialMedia.facebook,
          instagram: socialMedia.instagram,
          twitter: socialMedia.twitter,
          linkedin: socialMedia.linkedin
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      toast("Success", {
        description: "Company profile created successfully!"
      });
      
      navigate("/company-dashboard");
    } catch (error) {
      console.error("Error creating company:", error);
      toast("Error", {
        description: typeof error === 'string' ? error : "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to upload logo to Supabase storage
  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      if (!user) return null;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;
      
      // Create the storage bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .createBucket('company-content', {
          public: true,
          fileSizeLimit: 2097152, // 2MB
        });
      
      if (bucketError && bucketError.message !== 'Bucket already exists') {
        console.error("Error creating bucket:", bucketError);
        return null;
      }
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('company-content')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Error uploading logo:", uploadError);
        return null;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('company-content')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error in uploadLogo:", error);
      return null;
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Company Profile</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to EventStaff.com! Let's get your company set up to find the best event staff.
        </p>
        <Progress value={progress} className="w-full h-2 bg-secondary" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Basic Info</span>
          <span>Team Details</span>
          <span>Job Settings</span>
          <span>Hiring Process</span>
        </div>
      </div>

      <div className="space-y-8">
        {step === 1 && (
          <BasicInfoStep 
            form={basicInfoForm} 
            onNext={() => setStep(2)}
            isSubmitting={isSubmitting}
            currentStep={step}
            totalSteps={totalSteps}
          />
        )}

        {step === 2 && (
          <LocationStep 
            form={basicInfoForm} 
            onNext={() => setStep(3)}
            onPrevious={() => setStep(1)}
            isSubmitting={isSubmitting}
            currentStep={step}
            totalSteps={totalSteps}
          />
        )}

        {step === 3 && (
          <SocialMediaStep 
            form={socialMediaForm} 
            onPrevious={() => setStep(2)}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyOnboarding;
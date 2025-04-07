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
  } = useCompanyOnboardingForm();

  // redirect if not auth
  useEffect(() => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to continue with company onboarding"
      });
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const basicInfo = basicInfoForm.getValues();
      const socialMedia = socialMediaForm.getValues();
      
      const { data: currentCompany } = await supabase
        .from('companies')
        .select('logo_url')
        .eq('company_id', user.id)
        .single();
      
      const { error } = await supabase
        .from('companies')
        .update({
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
          logo_url: currentCompany?.logo_url,
          website: basicInfo.website,
          facebook: socialMedia.facebook,
          instagram: socialMedia.instagram,
          twitter: socialMedia.twitter,
          linkedin: socialMedia.linkedin
        })
        .eq('company_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast("Success", {
        description: "Company profile created successfully!"
      });
      
      window.location.href = "/dashboard";  // Force a full page reload and navigation
      return; // Make sure we exit after navigation
    } catch (error) {
      console.error("Error creating company:", error);
      toast("Error", {
        description: typeof error === 'string' ? error : "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
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
          <span>Location Info</span>
          <span>Social Media</span>
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
            onNext={onSubmit}
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
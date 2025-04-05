import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/Shared/components/ui/progress";
import BasicInfoStep from "./steps/BasicInfoStep";
import MediaStep from "./steps/MediaStep";
import SkillsStep from "./steps/SkillsStep";
import TravelPreferencesStep from "./steps/TravelPreferencesStep";
import { useStaffOnboardingForm } from "./useStaffOnboardingForm";
import { supabase } from "@/lib/supabase";

const StaffOnboardingPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const {
    basicInfoForm,
    socialMediaForm,
    skillsForm,
    travelPreferencesForm
  } = useStaffOnboardingForm();

  const onSubmit = async () => {
    try {
      const socialMediaValues = socialMediaForm.getValues();
      
      const formData = {
        ...basicInfoForm.getValues(),
        ...socialMediaValues,
        ...skillsForm.getValues(),
        ...travelPreferencesForm.getValues(),
        profilePhoto: socialMediaValues.profilePhoto?.[0] || null,
        resume: socialMediaValues.resume?.[0] || null,
      };
      
      console.log("Form submitted:", formData);
      toast.success("Profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Profile</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to Trusted Herd, our industry's number one choice for finding and being found. Please fill in the below fields. It's important to be as honest and accurate as possible.
        </p>
        <Progress value={progress} className="w-full h-2 bg-secondary [&>div]:bg-success" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Basic Info</span>
          <span>Media & Social</span>
          <span>Skills</span>
          <span>Travel</span>
        </div>
      </div>

      <div className="space-y-8">
        {step === 1 && (
          <BasicInfoStep 
            form={basicInfoForm} 
            onNext={() => setStep(2)} 
          />
        )}

        {step === 2 && (
          <MediaStep 
            form={socialMediaForm}
            onPrevious={() => setStep(1)} 
            onNext={() => setStep(3)} 
          />
        )}

        {step === 3 && (
          <SkillsStep 
            form={skillsForm}
            onPrevious={() => setStep(2)} 
            onNext={() => setStep(4)} 
          />
        )}

        {step === 4 && (
          <TravelPreferencesStep 
            form={travelPreferencesForm}
            onPrevious={() => setStep(3)} 
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default StaffOnboardingPage;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import BasicInfoStep from "./steps/BasicInfoStep";
import MediaStep from "./steps/MediaStep";
import SkillsStep from "./steps/SkillsStep";
import TravelPreferencesStep from "./steps/TravelPreferencesStep";
import { useStaffOnboardingForm } from "./useStaffOnboardingForm";

const StaffOnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const navigate = useNavigate();

  const {
    basicInfoForm,
    socialMediaForm,
    skillsForm,
    travelPreferencesForm
  } = useStaffOnboardingForm();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const onSubmit = async () => {
    try {
      const formData = {
        ...basicInfoForm.getValues(),
        ...socialMediaForm.getValues(),
        ...skillsForm.getValues(),
        ...travelPreferencesForm.getValues(),
        profilePhoto,
        resume,
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
            handlePhotoUpload={handlePhotoUpload}
            handleResumeUpload={handleResumeUpload}
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

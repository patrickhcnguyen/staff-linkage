import { useState, useEffect } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    basicInfoForm,
    socialMediaForm,
    skillsForm,
    travelPreferencesForm
  } = useStaffOnboardingForm();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Current session:', session); // Debug log
      if (error || !session) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, []);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('Not authenticated');

      const basicInfo = basicInfoForm.getValues();
      const socialMediaValues = socialMediaForm.getValues();
      const skillsValues = skillsForm.getValues();
      const travelPrefs = travelPreferencesForm.getValues();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: basicInfo.firstName,
          last_name: basicInfo.lastName,
          address: basicInfo.address,
          phone: basicInfo.phone,
          experience_years: Number(basicInfo.experienceYears),
          experience_months: Number(basicInfo.experienceMonths),
          gender: basicInfo.gender,
          birth_date: basicInfo.birthDate,
          height_feet: Number(basicInfo.heightFeet),
          height_inches: Number(basicInfo.heightInches),
          facebook_url: socialMediaValues.facebook,
          instagram_url: socialMediaValues.instagram,
          twitter_url: socialMediaValues.twitter,
          linkedin_url: socialMediaValues.linkedin,
          skills: skillsValues.skills,
          travel_nationally: travelPrefs.travelNationally,
          travel_duration: travelPrefs.travelDuration,
          notifications_enabled: travelPrefs.notifications,
          terms_accepted: travelPrefs.termsAccepted,
          is_onboarded: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: "top-center"
      });
      
      window.location.href = "/staff-dashboard";

    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.", {
        duration: 3000,
        position: "top-center"
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

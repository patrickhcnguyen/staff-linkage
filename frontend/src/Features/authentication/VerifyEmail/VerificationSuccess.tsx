import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { CheckCircle } from 'lucide-react';

const VerificationSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleVerificationSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const pendingProfileString = localStorage.getItem('pendingProfile');
      const pendingProfile = pendingProfileString ? JSON.parse(pendingProfileString) : {};

      // Check role and create appropriate profile
      if (pendingProfile.role === 'staff') {
        // Create staff profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            phone: pendingProfile.phone || '',
            first_name: '',
            last_name: '',
            address: '',
            gender: 'other',
            birth_date: new Date().toISOString(),
            experience_years: 0,
            experience_months: 0,
            height_feet: 5,
            height_inches: 0,
            is_onboarded: false
          });

        if (profileError) throw profileError;
        navigate('/staff-onboarding');
      } else if (pendingProfile.role === 'company') {
        // Create company profile
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            company_id: user.id,
            email: user.email,
            phone: pendingProfile.phone || '',
            // is_onboarded: false
          });

        if (companyError) throw companyError;
        navigate('/company-onboarding');
      }

      localStorage.removeItem('pendingProfile');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  useEffect(() => {
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
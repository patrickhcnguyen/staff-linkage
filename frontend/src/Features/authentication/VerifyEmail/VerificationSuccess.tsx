import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const VerificationSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleVerificationSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const pendingProfileString = localStorage.getItem('pendingProfile');
      const pendingProfile = pendingProfileString ? JSON.parse(pendingProfileString) : {};

      // create initial profile:
      // in case user gets verified but closes out, they should still be able to edit their profile, maybe remove is_onboarded tag
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

      localStorage.removeItem('pendingProfile');

      navigate('/staff-onboarding');
    } catch (error: any) {
      console.error('Error creating staff profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  useEffect(() => {
    handleVerificationSuccess();
  }, [navigate]);

  return (
    <div>Verification Success</div>
  );
};

export default VerificationSuccess; 
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/services/userService';
import { supabase } from '@/lib/supabase';

export interface UserData {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            first_name,
            last_name,
            address,
            email,
            phone,
            experience_years,
            experience_months,
            gender,
            birth_date,
            height_feet,
            height_inches,
            facebook_url,
            instagram_url,
            twitter_url,
            linkedin_url,
            skills,
            avatar_url,
            resume_url,
            travel_nationally,
            travel_duration,
            notifications_enabled,
            terms_accepted,
            is_onboarded,
            created_at,
            updated_at
          `)
          .eq('user_id', user.id)
          .single();

        setData({
          profile: profileData,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    };

    loadUserData();
  }, [user]);

  return data;
};

import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  phone: string;
  experience_years: number;
  experience_months: number;
  gender: string;
  birth_date: string;
  height_feet: number;
  height_inches: number;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  skills: string[];
  avatar_url: string;
  resume_url?: string;
  travel_nationally: boolean;
  travel_duration: string;
  notifications_enabled: boolean;
  terms_accepted: boolean;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as UserProfile;
};

export const createUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data as UserProfile;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  
  return data as UserProfile;
};

export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from('staff')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('staff')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error in uploadAvatar:", error);
    return null;
  }
};

export const updateUserResume = async (userId: string, file: File) : Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from('staff')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading resume:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('staff')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error in updateUserResume:", error);
    return null;
  }
}
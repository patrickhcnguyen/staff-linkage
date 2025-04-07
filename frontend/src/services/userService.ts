import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  skills: string[];
  experience: string[];
  education: string[];
  created_at: string;
  updated_at: string;
  rating?: number;
  experience_years: number;
  experience_months: number;
  height_feet: number;
  height_inches: number;
  birth_date: Date;
  role?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  certifications?: Array<{
    name: string;
    type: string;
    image?: string;
  }>;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  gallery_images?: string[];
  resume_url?: string;
  resume_name?: string;
  positions?: string[];
  jobs_count?: number;
  reviews_count?: number;
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


import { supabase } from '@/lib/supabase';

export interface CompanyProfileDB {
  id: string;
  user_id: string;
  name: string;
  type: string;
  logo_url: string;
  website: string;
  email: string;
  phone: string;
  description: string;
  founded: string;
  size: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  created_at: string;
  updated_at: string;
}

export const getCompanyByUserId = async (userId: string): Promise<CompanyProfileDB | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
  
  return data as CompanyProfileDB;
};

export const createCompany = async (company: Partial<CompanyProfileDB>): Promise<CompanyProfileDB | null> => {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating company:', error);
    return null;
  }
  
  return data as CompanyProfileDB;
};

export const updateCompany = async (companyId: string, updates: Partial<CompanyProfileDB>): Promise<CompanyProfileDB | null> => {
  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', companyId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating company:', error);
    return null;
  }
  
  return data as CompanyProfileDB;
};

export const getAllCompanies = async (): Promise<CompanyProfileDB[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*');
  
  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
  
  return data as CompanyProfileDB[];
};

export const getCompanyById = async (companyId: string): Promise<CompanyProfileDB | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();
  
  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }
  
  return data as CompanyProfileDB;
};

export const uploadCompanyLogo = async (file: File): Promise<string | null> => {
  try {
    // Get current authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Create bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage
      .createBucket('company-content', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Error creating bucket:', bucketError);
      return null;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    const { error } = await supabase.storage
      .from('company-content')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading company logo:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('company-content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error in uploadCompanyLogo:", error);
    return null;
  }
};

export const uploadGalleryImage = async (companyId: string, file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${companyId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `company-gallery/${fileName}`;

  const { error } = await supabase.storage
    .from('company-content')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading gallery image:', error);
    return null;
  }

  const { data } = supabase.storage
    .from('company-content')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

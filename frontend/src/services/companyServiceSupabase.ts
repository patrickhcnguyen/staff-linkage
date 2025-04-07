import { supabase } from '@/lib/supabase';
import { JobListing } from '@/services/jobService';

export interface CompanyProfileDB {
  id: string;
  company_id: string;
  name: string;
  type: string;
  logo_url: string;
  website: string;
  email: string;
  phone: string;
  number_of_employees: string; 
  description: string;
  founded: string;
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

export const getCompanyByUserId = async (companyID: string): Promise<CompanyProfileDB | null> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('company_id', companyID)
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

export const uploadCompanyLogo = async (companyId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${companyId}/${Math.random()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('companies')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('companies')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading company logo:', error);
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

// Calculate profile completion percentage
export const calculateProfileCompletion = async (companyId: string): Promise<number> => {
  const company = await getCompanyById(companyId);
  if (!company) return 0;

  const checks = {
    logo: company.logo_url !== "/placeholder.svg",
    basicInfo: !!company.name && !!company.type,
    description: !!company.description,
    contact: !!company.email && !!company.phone,
    location: !!(
      company.street && 
      company.city && 
      company.state && 
      company.zip_code
    ),
    social: Object.values({
      facebook: company.facebook,
      twitter: company.twitter,
      instagram: company.instagram,
      linkedin: company.linkedin
    }).some(url => !!url),
    website: !!company.website
  };
  
  const completed = Object.values(checks).filter(Boolean).length;
  const total = Object.values(checks).length;
  
  return (completed / total) * 100;
};

// Get company stats
export const getCompanyStats = async (companyId: string) => {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching company stats:', error);
    return {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      averageRating: 0
    };
  }

  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === "Active").length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applicants || 0), 0),
    averageRating: 4.8 // You might want to implement real rating calculation
  };
};

// Get all jobs for a company
export const getCompanyJobs = async (companyId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching company jobs:', error);
    return [];
  }

  return data;
};

// Get active jobs for a company
export const getActiveJobs = async (companyId: string) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .eq('status', 'Active');

  if (error) {
    console.error('Error fetching active jobs:', error);
    return [];
  }

  return data;
};

// Save a new job
export const saveJob = async (job: Omit<JobListing, "id">): Promise<JobListing | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();

  if (error) {
    console.error('Error saving job:', error);
    return null;
  }

  return data;
};

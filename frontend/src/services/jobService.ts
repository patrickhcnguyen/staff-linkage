import { supabase } from '@/lib/supabase';

export interface JobListing {
  id: string;
  company_id: string;
  title: string;
  location: string;
  job_type: string;
  pay_rate: string;
  start_date: string;
  posted_date: string;
  applicants_count: number;
  status: "Active" | "Closed" | "Draft";
  description: string;
  requirements: string[];
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: "Applied" | "Reviewing" | "Accepted" | "Rejected";
  message: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string;
    avatar_url: string;
    email: string;
    phone: string;
    skills: string[];
  };
  job?: {
    title: string;
    location: string;
    job_type: string;
  };
}

export const getJobsByCompany = async (companyId: string): Promise<JobListing[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId);
  
  if (error) {
    console.error('Error fetching company jobs:', error);
    return [];
  }
  
  return data as JobListing[];
};

export const getActiveJobs = async (): Promise<JobListing[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'Active');
  
  if (error) {
    console.error('Error fetching active jobs:', error);
    return [];
  }
  
  return data as JobListing[];
};

export const getJobById = async (jobId: string): Promise<JobListing | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();
  
  if (error) {
    console.error('Error fetching job:', error);
    return null;
  }
  
  return data as JobListing;
};

export const createJob = async (job: Partial<JobListing>): Promise<JobListing | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating job:', error);
    return null;
  }
  
  return data as JobListing;
};

export const updateJob = async (jobId: string, updates: Partial<JobListing>): Promise<JobListing | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating job:', error);
    return null;
  }
  
  return data as JobListing;
};

export const applyToJob = async (application: Partial<JobApplication>): Promise<JobApplication | null> => {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([application])
    .select()
    .single();
  
  if (error) {
    console.error('Error applying to job:', error);
    return null;
  }
  
  return data as JobApplication;
};

export const getJobApplicationsByUser = async (userId: string): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
  
  return data as JobApplication[];
};

export const getJobApplicationsByJob = async (jobId: string): Promise<JobApplication[]> => {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      user_profile:profiles(full_name, avatar_url, email, phone, skills)
    `)
    .eq('job_id', jobId);
  
  if (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
  
  return data as JobApplication[];
};

export const getJobApplicationsForCompany = async (companyId: string): Promise<JobApplication[]> => {
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id')
    .eq('company_id', companyId);
  
  if (jobsError || !jobs || jobs.length === 0) {
    console.error('Error fetching company jobs:', jobsError);
    return [];
  }
  
  const jobIds = jobs.map(job => job.id);
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      job:jobs(title, location, job_type),
      user_profile:profiles(full_name, avatar_url, email, phone, skills)
    `)
    .in('job_id', jobIds);
  
  if (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
  
  return data as JobApplication[];
};

export const updateJobApplication = async (applicationId: string, status: JobApplication['status']): Promise<JobApplication | null> => {
  const { data, error } = await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating job application:', error);
    return null;
  }
  
  return data as JobApplication;
};

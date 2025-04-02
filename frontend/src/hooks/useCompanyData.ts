
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompanyByUserId, CompanyProfileDB } from '@/services/companyServiceSupabase';
import { getJobsByCompany, JobListing } from '@/services/jobService';
import { supabase } from '@/lib/supabase';

export interface CompanyData {
  company: CompanyProfileDB | null;
  jobs: JobListing[];
  activeJobs: JobListing[];
  loading: boolean;
  error: string | null;
}

export const useCompanyData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CompanyData>({
    company: null,
    jobs: [],
    activeJobs: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // First try to get the company from the database
        const { data: companyData, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          // If no company found, that's ok - the user hasn't created one yet
          if (error.code === 'PGRST116') {
            setData({
              company: null,
              jobs: [],
              activeJobs: [],
              loading: false,
              error: null
            });
            return;
          }
          
          // For other errors, log and return the error
          console.error('Error fetching company data:', error);
          throw new Error(error.message);
        }
        
        if (companyData) {
          // Ensure companyData has the expected structure with keyPlayers as an array
          const updatedCompanyData = {
            ...companyData,
            // Make sure the keyPlayers property exists and is an array
            keyPlayers: [] // This will be populated from another table in the future
          };
          
          // Fetch jobs for this company 
          // For now just use empty arrays since we don't have real job data yet
          const jobs: JobListing[] = [];
          const activeJobs: JobListing[] = [];
          
          setData({
            company: updatedCompanyData as CompanyProfileDB,
            jobs,
            activeJobs,
            loading: false,
            error: null
          });
        } else {
          setData({
            company: null,
            jobs: [],
            activeJobs: [],
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error loading company data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: typeof error === 'string' ? error : 'Failed to load company data'
        }));
      }
    };

    loadCompanyData();
  }, [user]);

  return data;
};

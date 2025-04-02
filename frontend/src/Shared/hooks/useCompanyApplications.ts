
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompanyByUserId } from '@/services/companyServiceSupabase';
import { getJobApplicationsForCompany, JobApplication, updateJobApplication } from '@/services/jobService';
import { toast } from 'sonner';

export interface ApplicationsData {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  updateApplicationStatus: (applicationId: string, status: JobApplication['status']) => Promise<void>;
}

export const useCompanyApplications = (): ApplicationsData => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First get the company
        const company = await getCompanyByUserId(user.id);
        
        if (!company) {
          setLoading(false);
          setError('No company profile found');
          return;
        }
        
        // Then get all applications for this company
        const applications = await getJobApplicationsForCompany(company.id);
        setApplications(applications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const updateApplicationStatus = async (applicationId: string, status: JobApplication['status']) => {
    try {
      const updatedApplication = await updateJobApplication(applicationId, status);
      
      if (updatedApplication) {
        // Update the local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId ? { ...app, status } : app
          )
        );
        
        toast.success(`Application status updated to ${status}`);
      } else {
        toast.error('Failed to update application status');
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      toast.error('An error occurred while updating the application');
    }
  };

  return { applications, loading, error, updateApplicationStatus };
};

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CompanyProfileDB, getCompanyById } from '@/services/companyServiceSupabase';
import { supabase } from '@/lib/supabase';

export interface CompanyData {
  company: CompanyProfileDB | null;
  loading: boolean;
  error: string | null;
}

export const useCompanyData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<CompanyData>({
    company: null,
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
        const { data: companyData, error } = await supabase
          .from('companies')
          .select(`
            id,
            company_id,
            name,
            type,
            logo_url,
            website,
            email,
            phone,
            description,
            founded,
            number_of_employees,
            street,
            city,
            state,
            zip_code,
            facebook,
            twitter,
            instagram,
            linkedin,
            created_at,
            updated_at
          `)
          .eq('company_id', user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            setData({
              company: null,
              loading: false,
              error: null
            });
            return;
          }
          throw error;
        }

        setData({
          company: companyData,
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

    loadCompanyData();
  }, [user]);

  return data;
};

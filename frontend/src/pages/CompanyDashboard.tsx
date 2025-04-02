
import { useNavigate } from "react-router-dom";
import { Button } from "@/Shared/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyData } from "@/Shared/hooks/useCompanyData";
import { CompanyProfileCard } from "@/Shared/components/dashboard/CompanyProfile";
import ProfileCompletion from "@/Shared/components/dashboard/ProfileCompletion";
import CompanyStats from "@/Shared/components/dashboard/CompanyStats";
import ActiveJobs from "@/Shared/components/dashboard/ActiveJobs";
import { Loader2 } from "lucide-react";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { company, jobs, activeJobs, loading, error } = useCompanyData();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h3 className="text-xl font-medium mb-4">Authentication Required</h3>
        <p className="text-muted-foreground mb-6">Please sign in to access the company dashboard.</p>
        <Button onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h3 className="text-xl font-medium mb-4">Error Loading Dashboard</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h3 className="text-xl font-medium mb-4">No Company Profile</h3>
        <p className="text-muted-foreground mb-6">You haven't created a company profile yet.</p>
        <Button onClick={() => navigate('/company-onboarding')}>
          Create Company Profile
        </Button>
      </div>
    );
  }

  // Stats data
  const stats = {
    totalJobs: jobs.length,
    activeJobs: activeJobs.length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applicants_count || 0), 0),
    averageRating: 4.8 // Mock data until we have real ratings
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <CompanyProfileCard 
              company={company} 
              onEditClick={() => navigate('/edit-company-profile')} 
            />
            <div className="flex-1">
              <ProfileCompletion company={company} />
            </div>
          </div>
        </div>

        <CompanyStats 
          totalJobs={stats.totalJobs} 
          activeJobs={stats.activeJobs}
          totalApplications={stats.totalApplications}
          averageRating={stats.averageRating}
        />

        <ActiveJobs jobs={activeJobs} />
      </div>
    </div>
  );
};

export default CompanyDashboard;

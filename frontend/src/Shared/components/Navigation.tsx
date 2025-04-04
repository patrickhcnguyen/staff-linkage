import { Link } from "react-router-dom";
import { Button } from "@/Shared/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [userRole, setUserRole] = useState<"company" | "staff" | null>(null);
  const [loading, setLoading] = useState(true);
  const [companyOnboardingNeeded, setCompanyOnboardingNeeded] = useState(false);
  const [staffOnboardingNeeded, setStaffOnboardingNeeded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const determineUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        // get role
        const role = user.user_metadata?.role || JSON.parse(localStorage.getItem('pendingProfile') || '{}').role;
        
        if (role === 'company') {
          setUserRole("company");
          
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (companyError && companyError.code !== 'PGRST116') {
            console.error("Error fetching company profile:", companyError);
          }
          
          // If no company profile found, redirect to onboarding
          if (!companyData) {
            setCompanyOnboardingNeeded(true);
          }
        } else {
          // Set user as staff
          setUserRole("staff");
          
          // Check if staff has completed onboarding
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', user.id)
            .single();
          
          if (!error && (!data?.first_name || !data?.last_name)) {
            setStaffOnboardingNeeded(true);
          }
        }
      } catch (error) {
        console.error("Error determining user role:", error);
        setUserRole("staff");
      } finally {
        setLoading(false);
      }
    };

    determineUserRole();
  }, [user, navigate]);

  useEffect(() => {
    if (companyOnboardingNeeded && !loading && window.location.pathname !== '/company-onboarding') {
      navigate('/company-onboarding');
    } else if (staffOnboardingNeeded && !loading && window.location.pathname !== '/staff-onboarding') {
      navigate('/staff-onboarding');
    }
  }, [companyOnboardingNeeded, staffOnboardingNeeded, loading, navigate]);

  const renderLinks = () => {
    const commonLinks = [
      <Link to="/" className="font-semibold" key="home">
        Home
      </Link>
    ];

    if (user && loading) {
      return commonLinks;
    }

    if (userRole === "staff") {
      return [
        ...commonLinks,
        <Link to="/staff-info" className="text-foreground/60 hover:text-foreground" key="staff-info">
          For Staff
        </Link>,
        <Link to="/about" className="text-foreground/60 hover:text-foreground" key="about">
          About
        </Link>,
        <Link to="/dashboard" className="text-foreground/60 hover:text-foreground" key="dashboard">
          Dashboard
        </Link>,
        <Link to="/jobs" className="text-foreground/60 hover:text-foreground" key="jobs">
          Available Jobs
        </Link>,
        <Link to="/upcoming-jobs" className="text-foreground/60 hover:text-foreground" key="upcoming-jobs">
          My Bookings
        </Link>,
        <Link to="/messages" className="text-foreground/60 hover:text-foreground" key="messages">
          Messages
        </Link>,
        <Link to="/event-staff-directory" className="text-foreground/60 hover:text-foreground" key="companies">
          Companies
        </Link>,
      ];
    }

    if (userRole === "company") {
      return [
        ...commonLinks,
        <Link to="/company-dashboard" className="text-foreground/60 hover:text-foreground" key="company-dashboard">
          Dashboard
        </Link>,
        <Link to="/post-job" className="text-foreground/60 hover:text-foreground" key="post-job">
          Post Job
        </Link>,
        <Link to="/company-applications" className="text-foreground/60 hover:text-foreground" key="applications">
          Applications
        </Link>,
        <Link to="/messages" className="text-foreground/60 hover:text-foreground" key="messages">
          Messages
        </Link>,
        <Link to="/talent" className="text-foreground/60 hover:text-foreground" key="talent">
          Find Talent
        </Link>,
      ];
    }

    return [
      ...commonLinks,
      <Link to="/staff-info" className="text-foreground/60 hover:text-foreground" key="staff-info">
        For Staff
      </Link>,
      <Link to="/company-info" className="text-foreground/60 hover:text-foreground" key="company-info">
        For Companies
      </Link>,
      <Link to="/about" className="text-foreground/60 hover:text-foreground" key="about">
        About
      </Link>,
      <Link to="/event-staff-directory" className="text-foreground/60 hover:text-foreground" key="companies">
        Companies
      </Link>,
    ];
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            {renderLinks()}
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to={userRole === "company" ? "/edit-company-profile" : "/edit-profile"}>
                  <Button variant="outline">Edit Profile</Button>
                </Link>
                <Button variant="ghost" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

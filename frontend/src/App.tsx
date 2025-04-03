import { Routes, Route } from "react-router-dom";
import Navigation from "@/Shared/components/Navigation";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import EditProfile from "@/pages/EditProfile";
import AvailableJobs from "@/pages/AvailableJobs";
import JobDetails from "@/pages/JobDetails";
import ViewJob from "@/pages/ViewJob";
import UpcomingJobs from "@/pages/UpcomingJobs";
import Achievements from "@/pages/Achievements";
import Messages from "@/pages/Messages";
import EventStaffDirectory from "@/pages/EventStaffDirectory";
import CompanyProfile from "@/pages/CompanyProfile";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyApplications from "@/pages/CompanyApplications";
import PostJob from "@/pages/PostJob";
import NotFound from "@/pages/NotFound";
import CompanyOnboarding from "@/pages/CompanyOnboarding";
import StaffOnboarding from "@/pages/StaffOnboarding";
import EditCompanyProfile from "@/pages/EditCompanyProfile";
import TalentDirectory from "@/pages/TalentDirectory";
import CompanyMembership from "@/pages/CompanyMembership";

// Authentication
import SignUp from "@/Features/authentication/SignUp/SignUp";
import SignIn from "@/Features/authentication/SignIn/SignIn";
import VerifyEmail from "@/Features/authentication/VerifyEmail/VerifyEmail";

import About from "@/pages/About";
import StaffInfo from "@/pages/StaffInfo";
import CompanyInfo from "@/pages/CompanyInfo";
import { Toaster } from "@/Shared/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Routes>
        {/* Authentication routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} /> {/* Alternative route */}

        {/* Common routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/staff-info" element={<StaffInfo />} />
        <Route path="/company-info" element={<CompanyInfo />} />

        <Route path="/messages" element={<Messages />} />
        <Route path="/event-staff-directory" element={<EventStaffDirectory />} />
        <Route path="/event-staff-directory/:id" element={<CompanyProfile />} />
        <Route path="/talent" element={<TalentDirectory />} />
        
        {/* Staff routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/jobs" element={<AvailableJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/upcoming-jobs" element={<UpcomingJobs />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/staff-onboarding" element={<StaffOnboarding />} />
        
        {/* Company routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/view-job/:id" element={<ViewJob />} />
        <Route path="/company-applications" element={<CompanyApplications />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/company-onboarding" element={<CompanyOnboarding />} />
        <Route path="/edit-company-profile" element={<EditCompanyProfile />} />
        <Route path="/company-membership" element={<CompanyMembership />} />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

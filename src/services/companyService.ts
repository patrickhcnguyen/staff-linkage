
// Company data types
export interface CompanyProfile {
  id: string;
  name: string;
  type: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  description: string;
  founded: string;
  size: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  keyPlayers: {
    id: number;
    name: string;
    role: string;
    image: string;
    bio: string;
  }[];
  galleryImages: string[];
  completedProfile: boolean;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  payRate: string;
  startDate: string;
  postedDate: string;
  applicants: number;
  status: "Active" | "Closed" | "Draft";
  description: string;
  requirements: string[];
  companyId: string;
}

// Helper functions to work with localStorage
const COMPANY_STORAGE_KEY = "eventstaff_company_profile";
const JOBS_STORAGE_KEY = "eventstaff_company_jobs";

// Default company profile (for first-time users)
const defaultCompany: CompanyProfile = {
  id: "comp_" + Date.now(),
  name: "",
  type: "",
  logo: "/placeholder.svg",
  website: "",
  email: "",
  phone: "",
  description: "",
  founded: "",
  size: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: ""
  },
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: ""
  },
  keyPlayers: [],
  galleryImages: Array(9).fill(""),
  completedProfile: false
};

// Get company profile from localStorage
export const getCompanyProfile = (): CompanyProfile => {
  const storedCompany = localStorage.getItem(COMPANY_STORAGE_KEY);
  return storedCompany ? JSON.parse(storedCompany) : defaultCompany;
};

// Save company profile to localStorage
export const saveCompanyProfile = (company: CompanyProfile): CompanyProfile => {
  localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(company));
  return company;
};

// Update specific fields in company profile
export const updateCompanyProfile = (updates: Partial<CompanyProfile>): CompanyProfile => {
  const currentProfile = getCompanyProfile();
  const updatedProfile = { ...currentProfile, ...updates };
  return saveCompanyProfile(updatedProfile);
};

// Handle image upload and convert to base64 for storage
export const handleImageUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert image"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get all jobs for a company
export const getCompanyJobs = (): Job[] => {
  const storedJobs = localStorage.getItem(JOBS_STORAGE_KEY);
  return storedJobs ? JSON.parse(storedJobs) : [];
};

// Get active jobs for a company
export const getActiveJobs = (): Job[] => {
  return getCompanyJobs().filter(job => job.status === "Active");
};

// Save a new job
export const saveJob = (job: Omit<Job, "id">): Job => {
  const newJob: Job = {
    ...job,
    id: "job_" + Date.now(),
  };
  
  const currentJobs = getCompanyJobs();
  const updatedJobs = [...currentJobs, newJob];
  
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(updatedJobs));
  return newJob;
};

// Calculate profile completion percentage
export const calculateProfileCompletion = (profile: CompanyProfile): number => {
  const checks = {
    logo: profile.logo !== "/placeholder.svg",
    basicInfo: !!profile.name && !!profile.type,
    description: !!profile.description,
    contact: !!profile.email && !!profile.phone,
    location: !!profile.address.city && !!profile.address.state,
    social: Object.values(profile.socialMedia).some(url => !!url),
    gallery: profile.galleryImages.some(img => !!img),
    website: !!profile.website
  };
  
  const completed = Object.values(checks).filter(Boolean).length;
  const total = Object.values(checks).length;
  
  return (completed / total) * 100;
};

// Get stats for company dashboard
export const getCompanyStats = () => {
  const jobs = getCompanyJobs();
  
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.status === "Active").length,
    totalApplications: jobs.reduce((sum, job) => sum + job.applicants, 0),
    averageRating: 4.8 // Mock data since we don't have real ratings yet
  };
};

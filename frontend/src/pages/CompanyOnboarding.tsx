import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Shared/components/ui/form";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { Progress } from "@/Shared/components/ui/progress";
import { Textarea } from "@/Shared/components/ui/textarea";
import { Label } from "@/Shared/components/ui/label";
import { Building, Users, Briefcase, Handshake, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadCompanyLogo } from "@/services/companyServiceSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const companyInfoSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Company type must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL"),
  employeeCount: z.string().min(1, "Please select employee count"),
  description: z.string().min(10, "Please provide a brief company description"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number")
});

type CompanyInfoValues = z.infer<typeof companyInfoSchema>;

const CompanyOnboarding = () => {
  const [step, setStep] = useState(1);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("/placeholder.svg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to continue with company onboarding"
      });
      navigate('/login');
    }
  }, [user, navigate]);

  const companyInfoForm = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      website: "",
      employeeCount: "",
      description: "",
      email: "",
      phone: ""
    },
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CompanyInfoValues) => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in to continue"
      });
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload logo to Supabase Storage if available
      let logoUrl = "/placeholder.svg";
      if (logo) {
        logoUrl = await uploadLogo(logo);
        if (!logoUrl) {
          toast("Warning", {
            description: "Could not upload logo, using default image"
          });
          logoUrl = "/placeholder.svg";
        }
      }
      
      // Create company profile in Supabase
      const { data: companyData, error } = await supabase
        .from('companies')
        .insert([{
          user_id: user.id,
          name: data.companyName,
          type: data.industry,
          logo_url: logoUrl,
          website: data.website,
          email: data.email,
          phone: data.phone,
          description: data.description,
          size: data.employeeCount,
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Error creating company profile:", error);
        throw new Error(error.message);
      }
      
      toast("Success", {
        description: "Company profile created successfully!"
      });
      
      // Navigate to dashboard
      navigate("/company-dashboard");
    } catch (error) {
      console.error("Error creating company:", error);
      toast("Error", {
        description: typeof error === 'string' ? error : "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to upload logo to Supabase storage
  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      if (!user) return null;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `company-logos/${fileName}`;
      
      // Create the storage bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .createBucket('company-content', {
          public: true,
          fileSizeLimit: 2097152, // 2MB
        });
      
      if (bucketError && bucketError.message !== 'Bucket already exists') {
        console.error("Error creating bucket:", bucketError);
        return null;
      }
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('company-content')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error("Error uploading logo:", uploadError);
        return null;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('company-content')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Error in uploadLogo:", error);
      return null;
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Company Profile</h1>
        <p className="text-muted-foreground mb-6">
          Welcome to EventStaff.com! Let's get your company set up to find the best event staff.
        </p>
        <Progress value={progress} className="w-full h-2 bg-secondary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50">
          <Building className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-medium">Company Profile</h3>
            <p className="text-sm text-muted-foreground">Share your company's story and mission</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-medium">Team Details</h3>
            <p className="text-sm text-muted-foreground">Tell us about your team size and structure</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50">
          <Briefcase className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-medium">Job Postings</h3>
            <p className="text-sm text-muted-foreground">Start posting jobs and finding talent</p>
          </div>
        </div>
        <div className="flex items-start space-x-4 p-4 rounded-lg bg-secondary/50">
          <Handshake className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-medium">Hiring Process</h3>
            <p className="text-sm text-muted-foreground">Set up your hiring workflow</p>
          </div>
        </div>
      </div>

      <Form {...companyInfoForm}>
        <form onSubmit={companyInfoForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img 
                  src={logoPreview} 
                  alt="Company logo" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-border"
                />
                <label 
                  htmlFor="logo" 
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer"
                >
                  <Building className="h-5 w-5" />
                </label>
              </div>
              <div className="text-center">
                <Label htmlFor="logo">Company Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Click the icon to upload your logo
                </p>
              </div>
            </div>

            <FormField
              control={companyInfoForm.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={companyInfoForm.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Production Company, Venue, Agency" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={companyInfoForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={companyInfoForm.control}
                name="employeeCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={companyInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="contact@company.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={companyInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="(123) 456-7890" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={companyInfoForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us about your company..."
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Create Company Profile"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompanyOnboarding;

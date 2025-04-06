import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BasicCompanyInfoValues } from "../useCompanyOnboarding";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Shared/components/ui/form";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { Progress } from "@/Shared/components/ui/progress";
import { Textarea } from "@/Shared/components/ui/textarea";
import { Label } from "@/Shared/components/ui/label";
import { Building, Users, Briefcase, Handshake, Loader2 } from "lucide-react";

interface BasicInfoStepProps {
  form: UseFormReturn<BasicCompanyInfoValues>;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
}

const BasicInfoStep = ({ form, onNext, currentStep, totalSteps, isSubmitting = false }: BasicInfoStepProps) => {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("/placeholder.svg");

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

  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

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

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload Section */}
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

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Basic Info Fields */}
            <FormField
              control={form.control}
              name="name"
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
              control={form.control}
              name="type"
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

            {/* Website and Employee Count */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
                name="numberOfEmployees"
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

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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

            {/* Company Description */}
            <FormField
              control={form.control}
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
                Saving...
              </>
            ) : (
              "Next Step"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BasicInfoStep;


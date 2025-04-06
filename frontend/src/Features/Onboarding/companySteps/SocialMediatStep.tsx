import { UseFormReturn } from "react-hook-form";
import { SocialMediaValues } from "../useCompanyOnboarding";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/Shared/components/ui/form";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface SocialMediaStepProps {
  form: UseFormReturn<SocialMediaValues>;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const SocialMediaStep = ({ form, onPrevious, onSubmit, isSubmitting }: SocialMediaStepProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://facebook.com/your-company" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://instagram.com/your-company" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://twitter.com/your-company" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://linkedin.com/company/your-company" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="button" onClick={onPrevious} variant="outline" className="w-full">
            Previous
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Create Company Profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 
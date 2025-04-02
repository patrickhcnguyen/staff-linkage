
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialMediaValues } from "../useStaffOnboardingForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface MediaStepProps {
  form: UseFormReturn<SocialMediaValues>;
  onPrevious: () => void;
  onNext: () => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResumeUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MediaStep = ({ 
  form, 
  onPrevious, 
  onNext,
  handlePhotoUpload,
  handleResumeUpload
}: MediaStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile Photo</h3>
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resume</h3>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleResumeUpload}
        />
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input placeholder="facebook.com/" {...field} />
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
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input placeholder="instagram.com/" {...field} />
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
                <FormLabel>Twitter/X</FormLabel>
                <FormControl>
                  <Input placeholder="twitter.com/" {...field} />
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
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com/in/" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onPrevious}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={onNext}
              className="flex-1"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MediaStep;

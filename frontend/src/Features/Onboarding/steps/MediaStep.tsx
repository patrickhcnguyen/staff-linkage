import { useState, useEffect } from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/Shared/components/ui/button";
import { Input } from "@/Shared/components/ui/input";
import { SocialMediaValues } from "../useStaffOnboardingForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Shared/components/ui/form";

interface MediaStepProps {
  form: UseFormReturn<SocialMediaValues>;
  onPrevious: () => void;
  onNext: () => void;
}

const MediaStep = ({ form, onPrevious, onNext }: MediaStepProps) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const profilePhoto = form.watch('profilePhoto');

  useEffect(() => {
    if (profilePhoto?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(profilePhoto[0]);
    }
  }, [profilePhoto]);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <div className="space-y-4">
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resume"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Resume</FormLabel>
                <div className="space-y-4">
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
              <FormField
                key={social}
                control={form.control}
                name={social as keyof SocialMediaValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{social}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={`${social}.com/${social === 'linkedin' ? 'in/' : ''}`} 
                        value={field.value as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex gap-4 pt-4">
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

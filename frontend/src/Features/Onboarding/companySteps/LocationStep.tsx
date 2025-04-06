import { UseFormReturn } from "react-hook-form";
import { BasicCompanyInfoValues } from "../useCompanyOnboarding";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Shared/components/ui/form";
import { Input } from "@/Shared/components/ui/input";
import { Button } from "@/Shared/components/ui/button";
import { Loader2 } from "lucide-react";

interface LocationStepProps {
  form: UseFormReturn<BasicCompanyInfoValues>;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
}

const LocationStep = ({ form, onNext, onPrevious, currentStep, totalSteps, isSubmitting = false }: LocationStepProps) => {
  return (
    <div>
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }} className="space-y-6">
          <div className="space-y-4">
            {/* Address Fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter zip code" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Details */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="founded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Founded</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
              className="w-full"
            >
              Previous
            </Button>
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LocationStep;


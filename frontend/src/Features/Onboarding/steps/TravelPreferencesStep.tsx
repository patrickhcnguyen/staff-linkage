import { UseFormReturn } from "react-hook-form";
import { Button } from "@/Shared/components/ui/button";
import { Checkbox } from "@/Shared/components/ui/checkbox";
import { TravelPreferencesValues } from "../useStaffOnboardingForm";
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/Shared/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/Shared/components/ui/select";

interface TravelPreferencesStepProps {
  form: UseFormReturn<TravelPreferencesValues>;
  onPrevious: () => void;
  onSubmit: () => void;
}

const TravelPreferencesStep = ({ form, onPrevious, onSubmit }: TravelPreferencesStepProps) => {
  const navigate = useNavigate();
  const travelNationally = form.watch("travelNationally");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Travel Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Just a couple few more questions for you to answer.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={travelNationally ? "default" : "outline"}
                onClick={() => form.setValue("travelNationally", true)}
                className="w-full"
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={!travelNationally ? "default" : "outline"}
                onClick={() => form.setValue("travelNationally", false)}
                className="w-full"
              >
                No
              </Button>
            </div>
            <FormLabel>Willing to travel nationally?</FormLabel>
          </div>

          <FormField
            control={form.control}
            name="travelDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Willing to travel for longer periods?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select travel duration" />
                  </SelectTrigger>
                  <SelectContent className="max-h-36">
                    <SelectItem value="up_to_1_month">Up to 1 Month</SelectItem>
                    <SelectItem value="up_to_3_months">Up to 3 Months or Less</SelectItem>
                    <SelectItem value="up_to_6_months">Up to 6 Months</SelectItem>
                    <SelectItem value="more_than_6_months">More than 6 Months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I'd like to receive notifications of new jobs in my area.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    required
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <a href="#" className="text-primary underline">
                      Terms of Use and Privacy Policy
                    </a>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onPrevious}
            variant="outline"
          >
            Previous
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            onClick={() => {
              navigate('/dashboard');
            }}
          >
            Save Profile
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TravelPreferencesStep;

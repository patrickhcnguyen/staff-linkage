
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SkillsValues } from "../useStaffOnboardingForm";
import { Form } from "@/components/ui/form";
import { skillsCategories } from "../skillsData";

interface SkillsStepProps {
  form: UseFormReturn<SkillsValues>;
  onPrevious: () => void;
  onNext: () => void;
}

const SkillsStep = ({ form, onPrevious, onNext }: SkillsStepProps) => {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Skills & Experience</h3>
          <p className="text-sm text-muted-foreground">
            Select all the roles you're qualified and available to work in.
          </p>
          <div className="space-y-8">
            {skillsCategories.map((category) => (
              <div key={category.name} className="animate-fade-in">
                <h4 className="text-md font-medium mb-3 text-primary">{category.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-secondary/50 rounded-lg p-4">
                  {category.skills.map((skill) => (
                    <div
                      key={skill}
                      className="relative flex items-start space-x-2 bg-background rounded-md p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <Checkbox
                        id={skill}
                        className="mt-1"
                        onCheckedChange={(checked) => {
                          const currentSkills = form.getValues("skills");
                          if (checked) {
                            form.setValue("skills", [...currentSkills, skill]);
                          } else {
                            form.setValue(
                              "skills",
                              currentSkills.filter((s) => s !== skill)
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={skill}
                        className="text-sm leading-tight cursor-pointer"
                      >
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
            type="button"
            onClick={onNext}
            className="flex-1"
          >
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SkillsStep;

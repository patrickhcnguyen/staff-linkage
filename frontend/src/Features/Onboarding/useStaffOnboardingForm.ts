
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const basicInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  experienceYears: z.string(),
  experienceMonths: z.string(),
  gender: z.enum(["male", "female", "other"]),
  birthDate: z.string(),
  heightFeet: z.string(),
  heightInches: z.string(),
});

const socialMediaSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

const skillsSchema = z.object({
  skills: z.array(z.string()),
});

const travelPreferencesSchema = z.object({
  travelNationally: z.boolean(),
  travelDuration: z.string().default("up_to_3_months"),
  notifications: z.boolean(),
  termsAccepted: z.boolean(),
});

export type BasicInfoValues = z.infer<typeof basicInfoSchema>;
export type SocialMediaValues = z.infer<typeof socialMediaSchema>;
export type SkillsValues = z.infer<typeof skillsSchema>;
export type TravelPreferencesValues = z.infer<typeof travelPreferencesSchema>;

export const useStaffOnboardingForm = () => {
  const basicInfoForm = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      experienceYears: "0",
      experienceMonths: "0",
      gender: "male",
      birthDate: "",
      heightFeet: "5",
      heightInches: "0",
    },
  });

  const socialMediaForm = useForm<SocialMediaValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
  });

  const skillsForm = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  const travelPreferencesForm = useForm<TravelPreferencesValues>({
    resolver: zodResolver(travelPreferencesSchema),
    defaultValues: {
      travelNationally: false,
      travelDuration: "up_to_3_months",
      notifications: true,
      termsAccepted: false,
    },
  });

  return {
    basicInfoForm,
    socialMediaForm,
    skillsForm,
    travelPreferencesForm
  };
};

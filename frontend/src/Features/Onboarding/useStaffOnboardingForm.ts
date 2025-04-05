import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_RESUME_TYPES = ['application/pdf', 'application/doc'];

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
  profilePhoto: z
    .instanceof(FileList)
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      'Max image size is 5MB'
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional()
    .nullable(),
  resume: z
    .instanceof(FileList)
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
      'Max file size is 5MB'
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_RESUME_TYPES.includes(files[0].type),
      "Only PDF or doc format is supported."
    )
    .optional()
    .nullable(),
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
      profilePhoto: null,
      resume: null
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
